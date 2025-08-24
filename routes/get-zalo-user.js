// routes/get-zalo-user.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET thông tin người dùng từ Zalo OAuth
router.get('/', async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).json({ error: 'Thiếu access_token' });
  }

  try {
    const response = await axios.get('https://openapi.zalo.me/v2.0/me', {
      headers: {
        access_token: accessToken,
      },
    });

    const userData = response.data;

    res.json({
      message: 'Lấy thông tin người dùng Zalo thành công',
      data: userData,
    });

  } catch (error) {
    console.error('Lỗi khi lấy thông tin Zalo:', error.response?.data || error.message);
    res.status(500).json({ error: 'Không thể lấy thông tin từ Zalo' });
  }
});

module.exports = router;