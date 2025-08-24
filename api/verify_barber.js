
// api/verify_barber.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // đảm bảo bạn đã cấu hình db.js

router.post('/', (req, res) => {
  const { barber_id, is_verified, admin_note } = req.body;

  const sql = \`
    UPDATE barbers
    SET is_verified = ?, admin_note = ?
    WHERE id = ?
  \`;

  db.query(sql, [is_verified, admin_note, barber_id], (err, result) => {
    if (err) {
      console.error('Lỗi khi cập nhật:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
    res.json({ success: true, message: 'Cập nhật thành công' });
  });
});

module.exports = router;
