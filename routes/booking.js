 const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Đảm bảo rằng db.js đang export pool kết nối
const Joi = require('joi'); // Để xác thực đầu vào, bạn cần cài đặt: npm install joi

// --- Schema xác thực đầu vào cho Booking ---
const bookingSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required(),
  barber_id: Joi.number().integer().positive().required(),
  service_id: Joi.number().integer().positive().required(),
  booking_time: Joi.date().iso().required(), // Đảm bảo định dạng ISO 8601 (ví dụ: 2023-10-27T10:00:00Z)
  status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').default('pending'),
  total_price: Joi.number().precision(2).min(0).default(0),
  payment_status: Joi.string().valid('pending', 'paid', 'failed', 'refunded').default('pending'),
  payment_method: Joi.string().valid('cash_on_delivery', 'credit_card', 'bank_transfer', 'momo').default('cash_on_delivery'),
  payment_gateway_transaction_id: Joi.string().allow(null, '').optional(),
  notes: Joi.string().max(500).allow(null, '').optional()
});

// --- API đặt lịch (POST /api/bookings) ---
router.post('/', async (req, res) => {
  // 1. Xác thực đầu vào
  const { error, value } = bookingSchema.validate(req.body);
  if (error) {
    console.error('Lỗi xác thực dữ liệu:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    customer_id,
    barber_id,
    service_id,
    booking_time,
    status,
    total_price,
    payment_status,
    payment_method,
    payment_gateway_transaction_id,
    notes
  } = value; // Sử dụng 'value' sau khi đã xác thực và áp dụng giá trị mặc định

  const sql = `
    INSERT INTO bookings (
      customer_id, barber_id, service_id, booking_time, status, total_price,
      payment_status, payment_method, payment_gateway_transaction_id, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.execute(sql, [
      customer_id, barber_id, service_id, booking_time, status, total_price,
      payment_status, payment_method, payment_gateway_transaction_id, notes
    ]);
    // Sử dụng db.execute với mysql2/promise sẽ trả về mảng [rows, fields]
    // Với INSERT, rows sẽ chứa insertId

    res.status(201).json({
      message: 'Đặt lịch thành công',
      booking_id: result.insertId,
      data: value // Trả về dữ liệu đã được xác thực và lưu
    });

  } catch (err) {
    console.error('Lỗi khi đặt lịch vào CSDL:', err.message);

    // Xử lý các loại lỗi cụ thể hơn nếu có thể
    if (err.code === 'ER_DUP_ENTRY') { // Ví dụ lỗi trùng lặp nếu bạn có unique constraint
      return res.status(409).json({ error: 'Đặt lịch bị trùng hoặc xung đột dữ liệu.' });
    }
    // Các lỗi khác có thể bắt như ER_NO_REFERENCED_ROW_2 (khóa ngoại không tồn tại)
    // Để xử lý lỗi này, bạn cần kiểm tra sự tồn tại của customer_id, barber_id, service_id TRƯỚC khi insert

    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xử lý yêu cầu đặt lịch. Vui lòng thử lại sau.' });
  }
});

module.exports = router;