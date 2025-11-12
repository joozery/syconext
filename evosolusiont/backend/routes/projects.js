const express = require('express');
const router = express.Router();
const { getPool } = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');
const { generateDocumentNumber } = require('../utils/documentNumber');

// Create new project registration
router.post('/register', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const {
      agencyId,
      agencyName,
      agencyCode,
      coordinatorId,
      epcId,
      projectName,
      description,
      address,
      position,
      authority,
      upperUnit,
      lowerUnit,
      estimatedUsers,
      directorName,
      deliveryOfficer,
      deliveryPosition,
      province,
      district,
      subdistrict,
      postalCode,
      ministry,
      videoLink,
      authorizedPerson,
      affiliation,
      region,
      coordinator1Name,
      coordinator1Phone,
      coordinator1Code,
      coordinator2Name,
      coordinator2Phone,
      coordinator2Code,
      startDate,
      endDate,
      budget
    } = req.body;

    // Validation
    if (!agencyName) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'กรุณากรอกชื่อหน่วยงาน'
      });
    }

    if (!coordinatorId) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'กรุณาเลือกผู้ประสานงาน (Sale)'
      });
    }

    // Generate document number
    const documentNumber = await generateDocumentNumber('ชร');

    // Get database pool
    const pool = getPool();

    // Insert new project registration
    const [result] = await pool.execute(
      `INSERT INTO project_registrations (
        documentNumber, projectName, agencyName, agencyCode, agencyId, coordinatorId, epcId,
        address, position, authority, upperUnit, lowerUnit, estimatedUsers,
        directorName, deliveryOfficer, deliveryPosition,
        province, district, subdistrict, postalCode, region,
        ministry, videoLink, authorizedPerson, affiliation, description, status,
        coordinator1Name, coordinator1Phone, coordinator1Code,
        coordinator2Name, coordinator2Phone, coordinator2Code,
        startDate, endDate, budget, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        documentNumber,
        projectName || `โครงการติดตั้งโซล่าเซลล์ - ${agencyName}`,
        agencyName,
        agencyCode || null,
        agencyId || null,
        coordinatorId,
        epcId || null,
        address || null,
        position || null,
        authority || null,
        upperUnit || null,
        lowerUnit || null,
        estimatedUsers || null,
        directorName || null,
        deliveryOfficer || null,
        deliveryPosition || null,
        province || null,
        district || null,
        subdistrict || null,
        postalCode || null,
        region || null,
        ministry || null,
        videoLink || null,
        authorizedPerson || null,
        affiliation || null,
        description || null,
        'pending',
        coordinator1Name || null,
        coordinator1Phone || null,
        coordinator1Code || null,
        coordinator2Name || null,
        coordinator2Phone || null,
        coordinator2Code || null,
        startDate || null,
        endDate || null,
        budget || null
      ]
    );

    // Get the created project registration
    const [projectRegs] = await pool.execute(
      `SELECT pr.*, 
        c.fullName as coordinatorName, 
        c.phone as coordinatorPhone,
        c.email as coordinatorEmail
      FROM project_registrations pr
      LEFT JOIN coordinators c ON pr.coordinatorId = c.id
      WHERE pr.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนโครงการสำเร็จ',
      data: projectRegs[0]
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการลงทะเบียนโครงการ'
    });
  }
});

// Get all project registrations with pagination
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const pool = getPool();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const search = req.query.search;
    const region = req.query.region;

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];

    if (status) {
      whereConditions.push('pr.status = ?');
      queryParams.push(status);
    }

    if (region) {
      whereConditions.push('pr.region = ?');
      queryParams.push(region);
    }

    if (search) {
      whereConditions.push('(pr.projectName LIKE ? OR pr.agencyName LIKE ? OR c.fullName LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total
       FROM project_registrations pr
       LEFT JOIN coordinators c ON pr.coordinatorId = c.id
       ${whereClause}`,
      queryParams
    );

    const totalItems = countResult[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated project registrations
    const [projectRegs] = await pool.execute(
      `SELECT pr.*, 
        c.fullName as coordinatorName, 
        c.phone as coordinatorPhone,
        c.email as coordinatorEmail
      FROM project_registrations pr
      LEFT JOIN coordinators c ON pr.coordinatorId = c.id
      ${whereClause}
      ORDER BY pr.createdAt DESC
      LIMIT ${limit} OFFSET ${offset}`,
      queryParams
    );

    res.json({
      success: true,
      data: projectRegs,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    });

  } catch (error) {
    console.error('Get project registrations error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ'
    });
  }
});

// Get project registration by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const [projectRegs] = await pool.execute(
      `SELECT pr.*, 
        c.fullName as coordinatorName, 
        c.phone as coordinatorPhone, 
        c.email as coordinatorEmail
      FROM project_registrations pr
      LEFT JOIN coordinators c ON pr.coordinatorId = c.id
      WHERE pr.id = ?`,
      [req.params.id]
    );

    if (projectRegs.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบโครงการ'
      });
    }

    res.json({
      success: true,
      data: projectRegs[0]
    });

  } catch (error) {
    console.error('Get project registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลโครงการ'
    });
  }
});

// Update project registration
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const {
      projectName,
      agencyName,
      agencyCode,
      agencyId,
      coordinatorId,
      epcId,
      address,
      position,
      authority,
      upperUnit,
      lowerUnit,
      estimatedUsers,
      directorName,
      directorPhone,
      directorEmail,
      deliveryOfficer,
      deliveryPosition,
      province,
      district,
      subdistrict,
      postalCode,
      region,
      ministry,
      videoLink,
      authorizedPerson,
      affiliation,
      description,
      coordinator1Name,
      coordinator1Phone,
      coordinator1Code,
      coordinator2Name,
      coordinator2Phone,
      coordinator2Code,
      status,
      startDate,
      endDate,
      budget,
      notes, // เพิ่ม notes field
      equipmentData, // ข้อมูลอุปกรณ์ 12 แถว
      summaryData, // ข้อมูลรวมและเพิ่ม
      kWpData // ข้อมูล kWp
    } = req.body;

    const [existingProjectRegs] = await pool.execute(
      'SELECT id FROM project_registrations WHERE id = ?',
      [req.params.id]
    );

    if (existingProjectRegs.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบโครงการ'
      });
    }

    // Convert undefined to null for SQL compatibility
    const safeValue = (val) => val === undefined ? null : val;
    
    await pool.execute(
      `UPDATE project_registrations SET
        projectName = COALESCE(?, projectName),
        agencyName = COALESCE(?, agencyName),
        agencyCode = COALESCE(?, agencyCode),
        agencyId = COALESCE(?, agencyId),
        coordinatorId = COALESCE(?, coordinatorId),
        epcId = COALESCE(?, epcId),
        address = COALESCE(?, address),
        position = COALESCE(?, position),
        authority = COALESCE(?, authority),
        upperUnit = COALESCE(?, upperUnit),
        lowerUnit = COALESCE(?, lowerUnit),
        estimatedUsers = COALESCE(?, estimatedUsers),
        directorName = COALESCE(?, directorName),
        directorPhone = COALESCE(?, directorPhone),
        directorEmail = COALESCE(?, directorEmail),
        deliveryOfficer = COALESCE(?, deliveryOfficer),
        deliveryPosition = COALESCE(?, deliveryPosition),
        province = COALESCE(?, province),
        district = COALESCE(?, district),
        subdistrict = COALESCE(?, subdistrict),
        postalCode = COALESCE(?, postalCode),
        region = COALESCE(?, region),
        ministry = COALESCE(?, ministry),
        videoLink = COALESCE(?, videoLink),
        authorizedPerson = COALESCE(?, authorizedPerson),
        affiliation = COALESCE(?, affiliation),
        description = COALESCE(?, description),
        coordinator1Name = COALESCE(?, coordinator1Name),
        coordinator1Phone = COALESCE(?, coordinator1Phone),
        coordinator1Code = COALESCE(?, coordinator1Code),
        coordinator2Name = COALESCE(?, coordinator2Name),
        coordinator2Phone = COALESCE(?, coordinator2Phone),
        coordinator2Code = COALESCE(?, coordinator2Code),
        status = COALESCE(?, status),
        startDate = COALESCE(?, startDate),
        endDate = COALESCE(?, endDate),
        budget = COALESCE(?, budget),
        notes = COALESCE(?, notes),
        equipmentData = COALESCE(?, equipmentData),
        summaryData = COALESCE(?, summaryData),
        kWpData = COALESCE(?, kWpData),
        updatedAt = NOW()
      WHERE id = ?`,
      [
        safeValue(projectName), safeValue(agencyName), safeValue(agencyCode), 
        safeValue(agencyId), safeValue(coordinatorId), safeValue(epcId),
        safeValue(address), safeValue(position), safeValue(authority), 
        safeValue(upperUnit), safeValue(lowerUnit), safeValue(estimatedUsers),
        safeValue(directorName), safeValue(directorPhone), safeValue(directorEmail), 
        safeValue(deliveryOfficer), safeValue(deliveryPosition),
        safeValue(province), safeValue(district), safeValue(subdistrict), 
        safeValue(postalCode), safeValue(region),
        safeValue(ministry), safeValue(videoLink), safeValue(authorizedPerson), 
        safeValue(affiliation), safeValue(description),
        safeValue(coordinator1Name), safeValue(coordinator1Phone), safeValue(coordinator1Code),
        safeValue(coordinator2Name), safeValue(coordinator2Phone), safeValue(coordinator2Code),
        safeValue(status), safeValue(startDate), safeValue(endDate), safeValue(budget),
        safeValue(notes), // เพิ่ม notes parameter
        safeValue(equipmentData), // JSON string
        safeValue(summaryData), // JSON string
        safeValue(kWpData), // JSON string
        req.params.id
      ]
    );

    const [updatedProjectRegs] = await pool.execute(
      `SELECT pr.*, 
        c.fullName as coordinatorName, 
        c.phone as coordinatorPhone,
        c.email as coordinatorEmail
      FROM project_registrations pr
      LEFT JOIN coordinators c ON pr.coordinatorId = c.id
      WHERE pr.id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: 'อัปเดตโครงการสำเร็จ',
      data: updatedProjectRegs[0]
    });

  } catch (error) {
    console.error('Update project registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการอัปเดตโครงการ'
    });
  }
});

// Delete project registration
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const [existingProjectRegs] = await pool.execute(
      'SELECT id FROM project_registrations WHERE id = ?',
      [req.params.id]
    );

    if (existingProjectRegs.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบโครงการ'
      });
    }

    await pool.execute('DELETE FROM project_registrations WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'ลบโครงการสำเร็จ'
    });

  } catch (error) {
    console.error('Delete project registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการลบโครงการ'
    });
  }
});

module.exports = router;
