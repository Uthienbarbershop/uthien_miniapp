require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const crypto = require('crypto');

// Kết nối MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect(err => {
  if (err) {
    console.error('❌ Lỗi MySQL:', err.stack);
  } else {
    console.log('✅ Đã kết nối MySQL:', connection.threadId);
  }
});

// Middleware để xác minh chữ ký Zalo
router.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Gửi tin nhắn Zalo OA
const sendZaloMessage = async (userId, message) => {
  const token = process.env.ZALO_OA_ACCESS_TOKEN;
  if (!token) return console.error('❌ Thiếu ZALO_OA_ACCESS_TOKEN');

  try {
    const res = await fetch('https://openapi.zalo.me/v2.0/oa/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: token
      },
      body: JSON.stringify({
        recipient: { user_id: userId },
        message: { text: message }
      })
    });

    const data = await res.json();
    if (data.error !== 0) {
      console.error('❌ Lỗi gửi tin nhắn:', data.message);
    } else {
      console.log('✅ Đã gửi tin nhắn Zalo:', data);
    }
  } catch (err) {
    console.error('❌ Lỗi mạng khi gửi tin nhắn:', err);
  }
};

// Xử lý webhook
router.post('/', async (req, res) => {
  try {
    const signature = req.headers['x-zalo-signature'];
    const secret = process.env.ZALO_OA_SECRET_KEY;

    if (!signature || !req.rawBody || !secret) {
      return res.status(401).send('Unauthorized');
    }

    const expectedSig = crypto.createHmac('sha256', secret)
                              .update(req.rawBody)
                              .digest('hex');

    if (signature !== expectedSig) {
      return res.status(403).send('Forbidden');
    }

    const event = req.body.event_name;
    const userId = req.body.user_id_by_app || req.body.sender?.id || req.body.follower?.id;

    if (userId) {
      connection.query('INSERT IGNORE INTO users (zalo_id) VALUES (?)', [userId], (err) => {
        if (err) console.error('❌ Lỗi lưu user_id:', err);
        else console.log('✅ Đã lưu zalo_id:', userId);
      });
    }

    if (event === 'follow' && userId) {
      await sendZaloMessage(userId, '🎉 Cảm ơn bạn đã theo dõi Út Hiền Barbershop!');
    }

    if (event === 'user_send_text' && userId && req.body.message?.text) {
      const text = req.body.message.text;
      console.log(`📩 ${userId} gửi: "${text}"`);
      await sendZaloMessage(userId, `Út Hiền đã nhận: "${text}". Chúng tôi sẽ phản hồi sớm!`);
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('❌ Lỗi webhook:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;