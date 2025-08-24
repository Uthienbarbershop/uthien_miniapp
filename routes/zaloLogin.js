 // routes/zaloLogin.js
// require('dotenv').config(); // Chỉ cần require ở file server chính (app.js) một lần
const express = require('express');
const axios = require('axios');
const db = require('../config/db'); // Đảm bảo db là một instance kết nối DB đã sẵn sàng
const router = express.Router();

const zaloConfig = require('../config/zalo'); // Import cấu hình Zalo đã tạo

// Lấy thông tin từ zaloConfig
const {
  app_id: ZALO_APP_ID,
  app_secret: ZALO_APP_SECRET,
  redirect_uri: ZALO_CALLBACK_URL,
  oauth_base_url: ZALO_OAUTH_BASE_URL,
  api_base_url: ZALO_API_BASE_URL
} = zaloConfig;

// URL OAuth và API
const ZALO_OAUTH_PERMISSION_URL = `${ZALO_OAUTH_BASE_URL}/permission`;
const ZALO_TOKEN_URL = `${ZALO_OAUTH_BASE_URL}/access_token`;
const ZALO_ME_ENDPOINT = `${ZALO_API_BASE_URL}/me`; // Endpoint, sẽ thêm fields sau

// B1: Tạo link đăng nhập Zalo
// API: GET /api/zalo/login
router.get('/login', (req, res) => {
  // Optional: Thêm tham số 'state' để ngăn chặn CSRF (nên làm)
  // const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // req.session.oauth_state = state; // Lưu state vào session hoặc cookie

  const url = `${ZALO_OAUTH_PERMISSION_URL}?app_id=${ZALO_APP_ID}&redirect_uri=${encodeURIComponent(ZALO_CALLBACK_URL)}`;
  // Nếu có state: &state=${state}
  res.redirect(url);
});

// B2: Callback từ Zalo (nhận code → lấy token → lấy info)
// API: GET /api/zalo/callback
router.get('/callback', async (req, res) => {
  const { code /* , state */ } = req.query;

  // Optional: Kiểm tra 'state'
  // if (state !== req.session.oauth_state) {
  //   return res.status(403).send('Invalid state parameter');
  // }
  // delete req.session.oauth_state; // Xóa state sau khi xác thực

  if (!code) {
    console.error('Missing code from Zalo callback');
    return res.status(400).send('Missing authorization code from Zalo');
  }

  try {
    // Lấy access_token
    const tokenRes = await axios.post(ZALO_TOKEN_URL, null, { // Zalo API dùng application/x-www-form-urlencoded
      params: {
        app_id: ZALO_APP_ID,
        app_secret: ZALO_APP_SECRET,
        code: code,
        grant_type: 'authorization_code'
      }
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // Lấy thông tin người dùng
    const userRes = await axios.get(`${ZALO_ME_ENDPOINT}?fields=id,name,picture`, {
      headers: { access_token }
    });

    const zalo_id = userRes.data.id;
    const name = userRes.data.name || 'Người dùng Zalo';
    const avatar = userRes.data.picture?.data?.url || '';

    // Lưu vào MySQL
    const query = `
      INSERT INTO users (zalo_id, full_name, avatar_url, zalo_access_token, zalo_refresh_token, zalo_access_token_expires_at)
      VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))
      ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        avatar_url = VALUES(avatar_url),
        zalo_access_token = VALUES(zalo_access_token),
        zalo_refresh_token = VALUES(zalo_refresh_token),
        zalo_access_token_expires_at = VALUES(zalo_access_token_expires_at)
    `;
    db.query(query, [zalo_id, name, avatar, access_token, refresh_token, expires_in], (err) => {
      if (err) {
        console.error('DB Error during Zalo user save:', err);
        return res.status(500).send('Lỗi khi lưu thông tin người dùng vào cơ sở dữ liệu');
      }

      // Sau khi login xong → redirect về Mini App chính
      // Bạn có thể cân nhắc chuyển hướng đến một route front-end xử lý token và zalo_id
      return res.redirect(`/public/index.html?zalo_id=${zalo_id}&access_token=${access_token}`);
    });
  } catch (error) {
    console.error('Zalo login process failed:', error.response?.data || error.message);
    return res.status(500).send('Đăng nhập Zalo thất bại. Vui lòng thử lại.');
  }
});

module.exports = router;