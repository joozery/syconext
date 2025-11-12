const express = require('express');
const router = express.Router();
const { getPool } = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { sendNotificationToAdmins, NotificationTypes, createNotification } = require('../socket');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/coordinators');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `coordinator-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit for large files including videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @route   POST /api/coordinators
// @desc    Create new coordinator (Sale)
// @access  Public
router.post('/', upload.fields([
  { name: 'idCard', maxCount: 1 },
  { name: 'bankPassbook', maxCount: 1 }
]), async (req, res) => {
  console.log('📥 Create coordinator request received');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  
  try {
    const pool = getPool();
    const {
      fullName,
      idCardNumber,
      phone,
      email,
      bank,
      bankAccountNumber,
      bankAccountName,
      address,
      province,
      district,
      subdistrict,
      postalCode
    } = req.body;

    // Validate required fields
    if (!fullName || !idCardNumber || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ-นามสกุล, เลขบัตรประชาชน, เบอร์โทรศัพท์)'
      });
    }

    // Check if ID card number already exists
    const [existing] = await pool.execute(
      'SELECT id FROM coordinators WHERE idCardNumber = ?',
      [idCardNumber]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate ID card',
        message: 'เลขบัตรประชาชนนี้มีในระบบแล้ว'
      });
    }

    // Get uploaded file names
    const idCardFile = req.files && req.files.idCard ? req.files.idCard[0].filename : null;
    const bankBookFile = req.files && req.files.bankPassbook ? req.files.bankPassbook[0].filename : null;

    // Insert coordinator
    const [result] = await pool.execute(
      `INSERT INTO coordinators (
        fullName, idCardNumber, phone, email, bank, bankAccountNumber, 
        bankAccountName, address, province, district, subdistrict, postalCode,
        idCardFile, bankBookFile, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        fullName,
        idCardNumber,
        phone,
        email || null,
        bank || null,
        bankAccountNumber || null,
        bankAccountName || null,
        address || null,
        province || null,
        district || null,
        subdistrict || null,
        postalCode || null,
        idCardFile,
        bankBookFile
      ]
    );

    console.log('✅ Coordinator created, ID:', result.insertId);

    // Send notification to admins
    try {
      const notification = createNotification(
        NotificationTypes.COORDINATOR_REGISTER,
        `Sale/ผู้ประสานงานใหม่ลงทะเบียน: ${fullName}`,
        { coordinatorId: result.insertId, fullName, phone }
      );
      sendNotificationToAdmins(notification);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียน Sale สำเร็จ',
      data: {
        id: result.insertId,
        fullName,
        idCardNumber,
        phone,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Create coordinator error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

// @route   GET /api/coordinators
// @desc    Get all coordinators
// @access  Private (Admin)
router.get('/', authenticateToken, authorizeRole('admin', 'super-admin'), async (req, res) => {
  try {
    const pool = getPool();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions = [];
    const params = [];
    
    if (req.query.status) {
      conditions.push('status = ?');
      params.push(req.query.status);
    }

    if (req.query.search) {
      conditions.push('(fullName LIKE ? OR phone LIKE ? OR email LIKE ?)');
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Get coordinators with pagination
    const query = `SELECT * FROM coordinators ${whereClause} ORDER BY createdAt DESC LIMIT ${limit} OFFSET ${offset}`;
    const [coordinators] = await pool.execute(query, params);

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM coordinators ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        coordinators: coordinators,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get coordinators error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
});

// @route   GET /api/coordinators/:id
// @desc    Get coordinator by ID
// @access  Private (Admin)
router.get('/:id', authenticateToken, authorizeRole('admin', 'super-admin'), async (req, res) => {
  try {
    const pool = getPool();
    const [coordinators] = await pool.execute(
      'SELECT * FROM coordinators WHERE id = ?',
      [req.params.id]
    );

    if (coordinators.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบข้อมูล Sale'
      });
    }

    res.json({
      success: true,
      data: coordinators[0]
    });
  } catch (error) {
    console.error('Get coordinator error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
});

// @route   PUT /api/coordinators/:id
// @desc    Update coordinator
// @access  Private (Admin)
router.put('/:id', authenticateToken, authorizeRole('admin', 'super-admin'), async (req, res) => {
  try {
    const pool = getPool();
    const {
      fullName,
      idCardNumber,
      phone,
      email,
      bank,
      bankAccountNumber,
      bankAccountName,
      address,
      province,
      district,
      subdistrict,
      postalCode,
      status
    } = req.body;

    // Check if coordinator exists
    const [existingCoordinators] = await pool.execute(
      'SELECT id FROM coordinators WHERE id = ?',
      [req.params.id]
    );

    if (existingCoordinators.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบข้อมูล Sale'
      });
    }

    // Update coordinator
    await pool.execute(
      `UPDATE coordinators SET
        fullName = COALESCE(?, fullName),
        idCardNumber = COALESCE(?, idCardNumber),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        bank = COALESCE(?, bank),
        bankAccountNumber = COALESCE(?, bankAccountNumber),
        bankAccountName = COALESCE(?, bankAccountName),
        address = COALESCE(?, address),
        province = COALESCE(?, province),
        district = COALESCE(?, district),
        subdistrict = COALESCE(?, subdistrict),
        postalCode = COALESCE(?, postalCode),
        status = COALESCE(?, status),
        updatedAt = NOW()
      WHERE id = ?`,
      [
        fullName,
        idCardNumber,
        phone,
        email,
        bank,
        bankAccountNumber,
        bankAccountName,
        address,
        province,
        district,
        subdistrict,
        postalCode,
        status,
        req.params.id
      ]
    );

    // Get updated coordinator
    const [updatedCoordinators] = await pool.execute(
      'SELECT * FROM coordinators WHERE id = ?',
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'อัปเดตข้อมูล Sale สำเร็จ',
      data: updatedCoordinators[0]
    });
  } catch (error) {
    console.error('Update coordinator error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล'
    });
  }
});

// @route   PUT /api/coordinators/:id/approve
// @desc    Approve coordinator
// @access  Private (Admin)
router.put('/:id/approve', authenticateToken, authorizeRole('admin', 'super-admin'), async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.execute(
      'UPDATE coordinators SET status = ?, approvedBy = ?, approvedAt = NOW() WHERE id = ?',
      ['approved', req.user.id, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบข้อมูล Sale'
      });
    }

    res.json({
      success: true,
      message: 'อนุมัติ Sale สำเร็จ'
    });
  } catch (error) {
    console.error('Approve coordinator error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการอนุมัติ'
    });
  }
});

// @route   PUT /api/coordinators/:id/reject
// @desc    Reject coordinator
// @access  Private (Admin)
router.put('/:id/reject', authenticateToken, authorizeRole('admin', 'super-admin'), async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.execute(
      'UPDATE coordinators SET status = ? WHERE id = ?',
      ['rejected', req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบข้อมูล Sale'
      });
    }

    res.json({
      success: true,
      message: 'ปฏิเสธ Sale สำเร็จ'
    });
  } catch (error) {
    console.error('Reject coordinator error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการปฏิเสธ'
    });
  }
});

module.exports = router;

