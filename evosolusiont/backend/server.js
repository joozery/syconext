const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const { testConnection, initializeDatabase } = require('./database');
const { initializeSocket } = require('./socket');
const authRoutes = require('./routes/auth-mysql');
const userRoutes = require('./routes/users-mysql');
const addressRoutes = require('./routes/address');
const epcRoutes = require('./routes/epc');
const agencyRoutes = require('./routes/agencies');
const coordinatorRoutes = require('./routes/coordinators-mysql');
const projectRoutes = require('./routes/projects');
const projectStepsRoutes = require('./routes/project-steps');
const uploadsRoutes = require('./routes/uploads');
const documentVersionsRoutes = require('./routes/documentVersions');

const app = express();

// Security Middleware - Relaxed for browser access
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false
}));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.1.104:3000',
    'http://192.168.1.108:3000',
    'http://192.168.1.111:3000', // เพิ่ม IP ใหม่
    'https://devwooyou.space',
    'https://api.devwooyou.space'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Referer', 'User-Agent', 'Content-Length', 'Content-Range']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser Middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync(config.UPLOAD_PATH)) {
  fs.mkdirSync(config.UPLOAD_PATH, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/epc', epcRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/coordinators', coordinatorRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-steps', projectStepsRoutes);
app.use('/api/document-versions', documentVersionsRoutes);
app.use('/api/admin/uploads', uploadsRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'EEP Management System API is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error',
    ...(config.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Database Connection
async function startServer() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }

    // Initialize database tables
    await initializeDatabase();

    // Start Server
    const PORT = config.PORT;
    const HOST = config.HOST;
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on ${HOST}:${PORT}`);
      console.log(`📊 Environment: ${config.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${config.FRONTEND_URL}`);
      console.log(`🗄️  Database: ${config.DB_NAME}@${config.DB_HOST}:${config.DB_PORT}`);
    });

    // Initialize Socket.IO
    initializeSocket(server);
    console.log('🔌 Socket.IO ready for real-time notifications');

    // Set server timeout to prevent connection timeouts
    server.timeout = 30000; // 30 seconds
    server.keepAliveTimeout = 65000; // 65 seconds
    server.headersTimeout = 66000; // 66 seconds
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
