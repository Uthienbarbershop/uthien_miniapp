// File: config/db.js (Phiên bản khuyến nghị với Pool kết nối)

// 1. Tải và cấu hình biến môi trường từ tệp .env
// Đảm bảo rằng tệp .env của bạn nằm ở vị trí phù hợp với vị trí của file này.
// Ví dụ: Nếu file này nằm trong 'config/' và .env ở thư mục gốc, đường dẫn sẽ là '../.env'
require('dotenv').config({ path: '../.env' }); // Điều chỉnh đường dẫn nếu cần

// 2. Tải thư viện MySQL2 (sử dụng bản promise để làm việc với async/await dễ hơn)
const mysql = require('mysql2/promise'); // Rất quan trọng: Sử dụng '/promise'

// Thêm dòng log mới ở đây
console.log('🟡 Đang cố gắng kết nối đến MySQL...');

// 3. Tạo pool kết nối
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true, // Chờ nếu không có kết nối nào khả dụng
  connectionLimit: 10,      // Số lượng kết nối tối đa trong pool
  queueLimit: 0,            // Số lượng yêu cầu chờ trong hàng đợi (0 = không giới hạn)
  charset: 'utf8mb4'        // Đảm bảo hỗ trợ tiếng Việt và emoji
});

// 4. Kiểm tra kết nối pool khi khởi động (tùy chọn nhưng rất nên có)
pool.getConnection()
  .then(connection => {
    console.log('✅ Đã kết nối MySQL Pool thành công!');
    connection.release(); // Giải phóng kết nối trở lại pool
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối MySQL Pool:', err.message);
    // Quan trọng: Dừng ứng dụng nếu không thể kết nối đến cơ sở dữ liệu
    process.exit(1);
  });

// 5. Xuất pool để các file khác có thể sử dụng
module.exports = pool;