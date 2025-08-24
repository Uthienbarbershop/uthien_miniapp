
const express = require('express');
const router = express.Router();
const pool = require('./db');

// API: Lấy danh sách đánh giá theo barber_id
router.get('/barber/:id', async (req, res) => {
  const barberId = req.params.id;

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      'SELECT * FROM reviews WHERE barber_id = ? ORDER BY created_at DESC',
      [barberId]
    );
    conn.release();
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Lỗi khi truy vấn đánh giá:', err);
    res.status(500).json({ error: 'Không thể lấy danh sách đánh giá.' });
  }
});

module.exports = router;
