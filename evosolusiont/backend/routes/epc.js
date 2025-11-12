const express = require('express');
const multer = require('multer');
const path = require('path');
const { getPool } = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { sendNotificationToAdmins, NotificationTypes, createNotification } = require('../socket');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/epc/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'epc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for large files including videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์ PDF, JPG, PNG เท่านั้น'));
    }
  }
});

// @route   POST /api/epc/register
// @desc    Register new EPC company
// @access  Private (Admin only)
router.post('/register', authenticateToken, authorizeRole('admin'), upload.fields([
  { name: 'nda', maxCount: 1 },
  { name: 'companyCert', maxCount: 1 },
  { name: 'employmentContract', maxCount: 1 },
  { name: 'tndtContract', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      epcName,
      epcAddress,
      epcContact,
      taxId,
      province,
      district,
      subdistrict,
      postalCode,
      coordinatorName,
      coordinatorContact
    } = req.body;

    console.log('📝 EPC Registration request body:', req.body);
    console.log('📎 Files:', req.files);

    // Validation
    if (!epcName || !taxId || !epcAddress || !province) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    const pool = getPool();

    // Check if company already exists
    const [existing] = await pool.query(
      'SELECT id FROM epc_companies WHERE epcName = ? OR taxId = ?',
      [epcName, taxId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'บริษัทนี้ลงทะเบียนแล้ว'
      });
    }

    // Get file names from uploaded files
    const ndaFile = req.files?.nda ? req.files.nda[0].filename : null;
    const companyCertFile = req.files?.companyCert ? req.files.companyCert[0].filename : null;
    const employmentContractFile = req.files?.employmentContract ? req.files.employmentContract[0].filename : null;
    const tndtContractFile = req.files?.tndtContract ? req.files.tndtContract[0].filename : null;

    // Insert new EPC company
    const [result] = await pool.query(
      `INSERT INTO epc_companies 
       (epcName, taxId, epcAddress, epcContact, province, district, subdistrict, postalCode, 
        coordinatorName, coordinatorContact, nda_file, companyCert_file, 
        employmentContract_file, tndtContract_file, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [
        epcName, taxId, epcAddress, epcContact, province, district, subdistrict, postalCode,
        coordinatorName || null, coordinatorContact || null,
        ndaFile, companyCertFile, employmentContractFile, tndtContractFile
      ]
    );

    console.log('✅ EPC company registered successfully, ID:', result.insertId);

    // Send notification to admins
    try {
      const notification = createNotification(
        NotificationTypes.EPC_REGISTER,
        `บริษัท EPC ใหม่ลงทะเบียน: ${epcName}`,
        { epcId: result.insertId, epcName, taxId }
      );
      sendNotificationToAdmins(notification);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนบริษัท EPC สำเร็จ',
      data: {
        id: result.insertId,
        epcName
      }
    });
  } catch (error) {
    console.error('EPC register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

// @route   GET /api/epc
// @desc    Get all EPC companies
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [companies] = await pool.query(
      'SELECT * FROM epc_companies ORDER BY createdAt DESC'
    );

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Get EPC companies error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
});

// @route   GET /api/epc/list
// @desc    Get all EPC companies (alias for compatibility)
// @access  Private
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [companies] = await pool.query(
      'SELECT * FROM epc_companies ORDER BY createdAt DESC'
    );

    res.json({
      success: true,
      data: companies
    });
  } catch (error) {
    console.error('Get EPC companies error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
});

// @route   GET /api/epc/:id
// @desc    Get EPC company by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [companies] = await pool.query(
      'SELECT * FROM epc_companies WHERE id = ?',
      [req.params.id]
    );

    if (companies.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลบริษัท'
      });
    }

    res.json({
      success: true,
      data: companies[0]
    });
  } catch (error) {
    console.error('Get EPC company error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
});

module.exports = router;

