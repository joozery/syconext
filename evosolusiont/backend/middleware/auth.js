const jwt = require('jsonwebtoken');
const { getPool } = require('../database');
const config = require('../config');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔐 Auth middleware - Token:', token ? 'exists' : 'missing');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบ token กรุณาเข้าสู่ระบบ'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('✅ Token decoded, userId:', decoded.userId);

    // Get user from database
    const pool = getPool();
    const [users] = await pool.query(
      'SELECT id, email, firstName, lastName, phone, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    console.log('👤 Users found:', users.length);

    if (users.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'ไม่พบผู้ใช้หรือบัญชีถูกระงับ'
      });
    }

    const user = users[0];
    console.log('👤 User:', user.email, 'Role:', user.role);

    // Attach user to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      ...user
    };

    console.log('✅ Auth successful, user set');
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token หมดอายุ กรุณาเข้าสู่ระบบใหม่'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Token ไม่ถูกต้อง'
      });
    }

    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์'
    });
  }
};

// Middleware to check user role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    console.log('🔒 authorizeRole - user:', req.user ? req.user.email : 'none', 'role:', req.user ? req.user.role : 'none', 'required roles:', roles);
    
    if (!req.user) {
      console.log('❌ No user found in request');
      return res.status(401).json({
        success: false,
        message: 'กรุณาเข้าสู่ระบบ'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log('❌ Role not authorized:', req.user.role, 'Required:', roles);
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      });
    }

    console.log('✅ Role authorized');
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};

