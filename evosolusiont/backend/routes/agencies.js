const express = require('express');
const { getPool } = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { sendNotificationToAdmins, NotificationTypes, createNotification } = require('../socket');

const router = express.Router();

// @route   POST /api/agencies/register
// @desc    Register new government agency
// @access  Private (Admin only)
router.post('/register', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const {
      agencyName,
      agencyType,
      ministry,
      department,
      address,
      province,
      district,
      subdistrict,
      postalCode,
      phone,
      email,
      contactPerson,
      contactPosition
    } = req.body;

    // Validation
    if (!agencyName || !agencyType || !address || !province) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
      });
    }

    const pool = getPool();

    // Check if agency already exists
    const [existing] = await pool.query(
      'SELECT id FROM agencies WHERE agencyName = ?',
      [agencyName]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'หน่วยงานนี้ลงทะเบียนแล้ว'
      });
    }

    // Insert new agency
    const [result] = await pool.query(
      `INSERT INTO agencies 
       (agencyName, agencyType, ministry, department, address, province, district, subdistrict, 
        postalCode, phone, email, contactPerson, contactPosition, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [
        agencyName, agencyType, ministry, department, address, province, district, subdistrict,
        postalCode, phone, email, contactPerson, contactPosition
      ]
    );

    // Send notification to admins
    try {
      const notification = createNotification(
        NotificationTypes.AGENCY_REGISTER,
        `หน่วยงานใหม่ลงทะเบียน: ${agencyName} (${agencyType})`,
        { agencyId: result.insertId, agencyName, agencyType }
      );
      sendNotificationToAdmins(notification);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนหน่วยงานสำเร็จ',
      data: {
        id: result.insertId,
        agencyName
      }
    });
  } catch (error) {
    console.error('Agency register error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียน'
    });
  }
});

// @route   GET /api/agencies/search
// @desc    Search agencies by name (for autocomplete)
// @access  Private
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    console.log('🔍 Search agencies request, query:', q);
    
    if (!q || q.length < 2) {
      console.log('⚠️ Query too short or empty');
      return res.json({
        success: true,
        data: []
      });
    }

    const pool = getPool();
    const [agencies] = await pool.query(
      `SELECT id, agencyName, ministry, address, province, district, subdistrict, postalCode 
       FROM agencies 
       WHERE agencyName LIKE ? 
       ORDER BY agencyName 
       LIMIT 20`,
      [`%${q}%`]
    );

    console.log(`✅ Found ${agencies.length} agencies matching "${q}"`);

    res.json({
      success: true,
      data: agencies
    });
  } catch (error) {
    console.error('Search agencies error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการค้นหา'
    });
  }
});

// @route   GET /api/agencies
// @desc    Get all government agencies
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [agencies] = await pool.query(
      'SELECT * FROM agencies ORDER BY createdAt DESC'
    );

    res.json({
      success: true,
      data: agencies
    });
  } catch (error) {
    console.error('Get agencies error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
});

// @route   GET /api/agencies/:id
// @desc    Get agency by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [agencies] = await pool.query(
      'SELECT * FROM agencies WHERE id = ?',
      [req.params.id]
    );

    if (agencies.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลหน่วยงาน'
      });
    }

    res.json({
      success: true,
      data: agencies[0]
    });
  } catch (error) {
    console.error('Get agency error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    });
  }
});

// @route   PUT /api/agencies/:id
// @desc    Update agency
// @access  Private (Admin only)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const {
      agencyName,
      agencyType,
      ministry,
      department,
      address,
      province,
      district,
      subdistrict,
      postalCode,
      phone,
      email,
      contactPerson,
      contactPosition,
      status
    } = req.body;

    const pool = getPool();

    // Check if agency exists
    const [existing] = await pool.query(
      'SELECT id FROM agencies WHERE id = ?',
      [req.params.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลหน่วยงาน'
      });
    }

    // Update agency
    await pool.query(
      `UPDATE agencies 
       SET agencyName = ?, agencyType = ?, ministry = ?, department = ?, address = ?, 
           province = ?, district = ?, subdistrict = ?, postalCode = ?, phone = ?, 
           email = ?, contactPerson = ?, contactPosition = ?, status = ?, updatedAt = NOW()
       WHERE id = ?`,
      [
        agencyName, agencyType, ministry, department, address, province, district, subdistrict,
        postalCode, phone, email, contactPerson, contactPosition, status, req.params.id
      ]
    );

    res.json({
      success: true,
      message: 'อัปเดตข้อมูลหน่วยงานสำเร็จ'
    });
  } catch (error) {
    console.error('Update agency error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปเดต'
    });
  }
});

// @route   DELETE /api/agencies/:id
// @desc    Delete agency
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pool = getPool();

    const [result] = await pool.query(
      'DELETE FROM agencies WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลหน่วยงาน'
      });
    }

    res.json({
      success: true,
      message: 'ลบข้อมูลหน่วยงานสำเร็จ'
    });
  } catch (error) {
    console.error('Delete agency error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบข้อมูล'
    });
  }
});

module.exports = router;

