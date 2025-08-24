
// api/get_notifications.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // đường dẫn đến db.js

router.get('/', (req, res) => {
  const userId = req.query.user_id;
  const type = req.query.type || null;

  if (!userId) return res.status(400).json({ success: false, message: 'Thiếu user_id' });

  let sql = 'SELECT * FROM notifications WHERE user_id = ?';
  let params = [userId];

  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }

  sql += ' ORDER BY created_at DESC LIMIT 100';

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Lỗi lấy thông báo:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
    res.json({ success: true, data: result });
  });
});

module.exports = router;
