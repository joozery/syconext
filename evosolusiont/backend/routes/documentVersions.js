const express = require('express');
const router = express.Router();
const { getPool } = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { generateDocumentNumber } = require('../utils/documentNumber');

// Get all versions for a project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const { projectId } = req.params;

    const [versions] = await pool.execute(
      `SELECT dv.*, pr.agencyName, pr.coordinatorName, pr.coordinatorPhone
       FROM document_versions dv
       LEFT JOIN project_registrations pr ON dv.project_id = pr.id
       WHERE dv.project_id = ?
       ORDER BY dv.version_number ASC`,
      [projectId]
    );

    res.json({
      success: true,
      data: versions
    });

  } catch (error) {
    console.error('Get document versions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการแก้ไข'
    });
  }
});

// Create new version (edit document)
router.post('/project/:projectId', authenticateToken, authorizeRole('admin', 'super-admin'), async (req, res) => {
  try {
    const pool = getPool();
    const { projectId } = req.params;
    const { editedData, editReason, editedBy } = req.body;

    // Check current version count
    const [currentVersions] = await pool.execute(
      'SELECT COUNT(*) as count FROM document_versions WHERE project_id = ?',
      [projectId]
    );

    const currentVersionCount = currentVersions[0].count;

    // Limit to 3 edits maximum
    if (currentVersionCount >= 3) {
      return res.status(400).json({
        success: false,
        error: 'Edit limit exceeded',
        message: 'ไม่สามารถแก้ไขได้เกิน 3 ครั้ง'
      });
    }

    // Get original project data
    const [originalProject] = await pool.execute(
      'SELECT * FROM project_registrations WHERE id = ?',
      [projectId]
    );

    if (originalProject.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบโครงการ'
      });
    }

    const originalData = originalProject[0];
    const newVersionNumber = currentVersionCount + 1;

    // Generate new document number for this version
    const newDocumentNumber = await generateDocumentNumber('ชร');

    // Create new version record
    const [result] = await pool.execute(
      `INSERT INTO document_versions (
        project_id, version_number, document_number, 
        original_data, edited_data, edited_by, edit_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        newVersionNumber,
        newDocumentNumber,
        JSON.stringify(originalData),
        JSON.stringify(editedData),
        editedBy || 'admin',
        editReason || 'การแก้ไขเอกสาร'
      ]
    );

    // Update the main project with new data (only fields that are provided)
    const updateFields = [];
    const updateValues = [];
    
    if (editedData.ministry !== undefined) {
      updateFields.push('ministry = ?');
      updateValues.push(editedData.ministry);
    }
    if (editedData.affiliation !== undefined) {
      updateFields.push('affiliation = ?');
      updateValues.push(editedData.affiliation);
    }
    if (editedData.coordinatorId !== undefined) {
      updateFields.push('coordinatorId = ?');
      updateValues.push(editedData.coordinatorId);
    }
    
    // Always update timestamp
    updateFields.push('updatedAt = NOW()');
    updateValues.push(projectId);
    
    if (updateFields.length > 1) { // More than just updatedAt
      await pool.execute(
        `UPDATE project_registrations SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    res.status(201).json({
      success: true,
      message: `สร้างการแก้ไขครั้งที่ ${newVersionNumber} สำเร็จ`,
      data: {
        versionId: result.insertId,
        versionNumber: newVersionNumber,
        documentNumber: newDocumentNumber
      }
    });

  } catch (error) {
    console.error('Create document version error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการสร้างการแก้ไข'
    });
  }
});

// Get specific version
router.get('/:versionId', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const { versionId } = req.params;

    const [versions] = await pool.execute(
      `SELECT dv.*, pr.agencyName, pr.coordinatorName, pr.coordinatorPhone
       FROM document_versions dv
       LEFT JOIN project_registrations pr ON dv.project_id = pr.id
       WHERE dv.id = ?`,
      [versionId]
    );

    if (versions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบข้อมูลการแก้ไข'
      });
    }

    res.json({
      success: true,
      data: versions[0]
    });

  } catch (error) {
    console.error('Get document version error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการแก้ไข'
    });
  }
});

// Get project with all versions info
router.get('/project/:projectId/summary', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const { projectId } = req.params;

    // Get main project data
    const [project] = await pool.execute(
      `SELECT pr.*, 
        c.fullName as coordinatorName, 
        c.phone as coordinatorPhone,
        c.email as coordinatorEmail
      FROM project_registrations pr
      LEFT JOIN coordinators c ON pr.coordinatorId = c.id
      WHERE pr.id = ?`,
      [projectId]
    );

    if (project.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบโครงการ'
      });
    }

    // Get version count
    const [versionCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM document_versions WHERE project_id = ?',
      [projectId]
    );

    // Get all versions
    const [versions] = await pool.execute(
      `SELECT *, 
        created_at as createdAt
      FROM document_versions 
      WHERE project_id = ? 
      ORDER BY version_number ASC`,
      [projectId]
    );

    res.json({
      success: true,
      data: {
        project: project[0],
        versionCount: versionCount[0].count,
        versions: versions,
        canEdit: versionCount[0].count < 3
      }
    });

  } catch (error) {
    console.error('Get project summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสรุปโครงการ'
    });
  }
});

module.exports = router;
