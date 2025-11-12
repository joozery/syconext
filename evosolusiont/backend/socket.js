const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./config');

let io = null;

// Initialize Socket.IO
const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://devwooyou.space'],
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware for socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, config.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      socket.userRole = decoded.role;
      
      console.log('✅ Socket authenticated:', socket.userEmail, 'Role:', socket.userRole);
      next();
    } catch (error) {
      console.error('❌ Socket authentication failed:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('🔌 New socket connection:', socket.id, 'User:', socket.userEmail);

    // Join admin room if user is admin
    if (socket.userRole === 'admin') {
      socket.join('admin-room');
      console.log('👑 Admin joined admin-room:', socket.userEmail);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected:', socket.id);
    });

    // Handle notification acknowledgment
    socket.on('notification:read', (notificationId) => {
      console.log('✓ Notification read:', notificationId, 'by', socket.userEmail);
    });
  });

  console.log('🚀 Socket.IO initialized');
  return io;
};

// Get Socket.IO instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
};

// Send notification to all admins
const sendNotificationToAdmins = (notification) => {
  try {
    const io = getIO();
    io.to('admin-room').emit('notification', notification);
    console.log('📢 Notification sent to admins:', notification.message);
  } catch (error) {
    console.error('❌ Failed to send notification:', error.message);
  }
};

// Notification types and helper functions
const NotificationTypes = {
  USER_LOGIN: 'user_login',
  USER_REGISTER: 'user_register',
  EPC_REGISTER: 'epc_register',
  AGENCY_REGISTER: 'agency_register',
  COORDINATOR_REGISTER: 'coordinator_register',
  PROJECT_REGISTER: 'project_register',
  APPROVAL_REQUEST: 'approval_request'
};

// Create notification object
const createNotification = (type, message, data = {}) => {
  return {
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    type,
    message,
    data,
    timestamp: new Date().toISOString(),
    read: false
  };
};

module.exports = {
  initializeSocket,
  getIO,
  sendNotificationToAdmins,
  NotificationTypes,
  createNotification
};


