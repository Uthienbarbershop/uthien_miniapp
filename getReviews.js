const express = require('express');
const router = express.Router();
const connection = require('./db'); // Dùng kết nối từ db.js

router.get('/barber/:barber_id', async (req, res) => {
  const barberId = req.params.barber_id;

  try {
    const [rows] = await connection.execute(
      'SELECT rating, comment, created_at FROM reviews WHERE barber_id = ? ORDER BY created_at DESC',
      [barberId]
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ Lỗi truy vấn đánh giá:', err.message);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;