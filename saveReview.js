const express = require('express');
const router = express.Router();
const pool = require('./db');

router.post('/review', async (req, res) => {
  const { customer_id, barber_id, rating, comment } = req.body;

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      'INSERT INTO reviews (customer_id, barber_id, rating, comment) VALUES (?, ?, ?, ?)',
      [customer_id, barber_id, rating, comment]
    );
    conn.release();
    res.status(200).json({ message: '✅ Đánh giá đã được lưu!' });
  } catch (err) {
    console.error('❌ Lỗi lưu đánh giá:', err);
    res.status(500).json({ error: 'Không thể lưu đánh giá.' });
  }
});

module.exports = router;