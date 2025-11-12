const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../database');
const config = require('../config');
const { authenticateToken } = require('../middleware/auth');
const { sendNotificationToAdmins, NotificationTypes, createNotification } = require('../socket');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'user' } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'รูปแบบอีเมลไม่ถูกต้อง'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
      });
    }

    const pool = getPool();

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'อีเมลนี้ถูกใช้งานแล้ว'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO users (email, password, firstName, lastName, phone, role, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [email, hashedPassword, firstName, lastName, phone || null, role]
    );

    // Create JWT token
    const token = jwt.sign(
      { userId: result.insertId, email, role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );

    // Send notification to admins
    try {
      const notification = createNotification(
        NotificationTypes.USER_REGISTER,
        `ผู้ใช้ใหม่ลงทะเบียน: ${firstName} ${lastName} (${email})`,
        { userId: result.insertId, email, role }
      );
      sendNotificationToAdmins(notification);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      data: {
        token,
        user: {
          id: result.insertId,
          email,
          firstName,
          lastName,
          phone,
          role
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('📥 Login request received');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกอีเมลและรหัสผ่าน'
      });
    }

    const pool = getPool();

    // Find user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // Update last login (commented out - lastLogin column doesn't exist)
    // await pool.query(
    //   'UPDATE users SET lastLogin = NOW() WHERE id = ?',
    //   [user.id]
    // );

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );

    console.log('✅ Login successful for:', email);

    // Send notification to admins
    try {
      const notification = createNotification(
        NotificationTypes.USER_LOGIN,
        `${user.firstName} ${user.lastName} เข้าสู่ระบบ (${user.role})`,
        { userId: user.id, email: user.email, role: user.role }
      );
      sendNotificationToAdmins(notification);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();

    const query = 'SELECT id, email, firstName, lastName, phone, role, createdAt FROM users WHERE id = ?';
    console.log('🔍 /me query:', query);
    const [users] = await pool.query(query, [req.user.userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    const user = users[0];
    res.json({
      success: true,
      data: {
        user: {
          ...user,
          name: `${user.firstName} ${user.lastName}`
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'ออกจากระบบสำเร็จ'
  });
});

module.exports = router;

