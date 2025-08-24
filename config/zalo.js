// zalo.js
module.exports = {
  app_id: process.env.ZALO_APP_ID,
  app_secret: process.env.ZALO_APP_SECRET,
  redirect_uri: process.env.ZALO_REDIRECT_URI,
  oa_access_token: process.env.ZALO_OA_ACCESS_TOKEN,
  api_base_url: 'https://openapi.zalo.me/v2.0', // Bạn có thể thay đổi thành v3.0 nếu API yêu cầu
  oauth_base_url: 'https://oauth.zaloapp.com/v4',
};