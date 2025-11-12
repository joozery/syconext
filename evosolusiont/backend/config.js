require('dotenv').config();

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '0.0.0.0',

  // Database Configuration (MySQL)
  DB_HOST: process.env.DB_HOST || '145.223.21.117',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'eep_management',
  DB_USER: process.env.DB_USER || 'debian-sys-maint',
  DB_PASSWORD: process.env.DB_PASSWORD || 'Str0ngP@ssw0rd!',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'eep-management-system-super-secret-jwt-key-2024',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // File Upload Configuration
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 20971520, // 20MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

  // CORS Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3002',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
};
