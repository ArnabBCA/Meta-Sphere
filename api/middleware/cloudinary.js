const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: '_jUoItwmXAWzSDTUNkGyLb7IIgg' 
});

module.exports = cloudinary;