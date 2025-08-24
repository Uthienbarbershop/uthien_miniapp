// zalopay.js
module.exports = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY1,
  key2: process.env.ZALOPAY_KEY2,
  endpoint_create_order: 'https://sb-openapi.zalopay.vn/v2/create', // Hoặc 'https://openapi.zalopay.vn/v2/create' cho môi trường production
  endpoint_check_status: 'https://sb-openapi.zalopay.vn/v2/query', // Hoặc 'https://openapi.zalopay.vn/v2/query' cho môi trường production
  callback_url: process.env.ZALOPAY_CALLBACK_URL,
};