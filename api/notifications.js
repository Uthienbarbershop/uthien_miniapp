// api/notifications.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const sql = `SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
    res.json(results);
  });
});

module.exports = router;