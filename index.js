const db = require('./config/db');
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

// Import các API route
const zaloWebhook = require('./zalo-webhook.js');
const getReviews = require('./getReviews');
const saveReview = require('./saveReview');
const getBarberReviews = require('./getBarberReviews');
const getZaloUser = require('./routes/get-zalo-user');
const zaloLogin = require('./routes/zaloLogin');

// Kết nối các router
app.use('/webhook', zaloWebhook);
app.use('/api', getReviews);
app.use('/api', saveReview);
app.use('/api', getBarberReviews);
app.use('/api/zalo-user', getZaloUser);
app.use('/api/zalo-login', zaloLogin);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ⚠️ Xử lý tất cả các route không khớp → trả về 404.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});