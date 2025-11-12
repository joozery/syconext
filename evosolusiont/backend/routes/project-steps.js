const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getPool } = require('../database');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/project-steps');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'step-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // รองรับหลายประเภทไฟล์
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xlsx|xls|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // MIME types ที่รองรับ
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed'
    ];
    
    const mimetypeValid = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetypeValid) {
      return cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์ประเภท .jpg, .jpeg, .png, .pdf, .doc, .docx, .xls, .xlsx, .zip, .rar เท่านั้น'));
    }
  }
});

// Get all project steps for a project
router.get('/:projectId', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const { projectId } = req.params;

    // Check if project exists
    const [projects] = await pool.execute(
      'SELECT id FROM project_registrations WHERE id = ?',
      [projectId]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบโครงการ'
      });
    }

    // Get all steps for this project
    const [steps] = await pool.execute(
      `SELECT * FROM project_steps 
       WHERE projectId = ? 
       ORDER BY stepNumber ASC`,
      [projectId]
    );

    // If no steps exist, initialize default 16 steps
    if (steps.length === 0) {
      const defaultSteps = [
        { stepNumber: 1, name: 'ตกลงวันที่บริษัยมาทำ', description: 'นัดหมายและตกลงวันที่เริ่มดำเนินการ' },
        { stepNumber: 2, name: 'ยกเครื่องตัดอัฐมีขวาง', description: 'ติดตั้งและยกเครื่องตัดอัฐมีขวางขึ้นหลังคา' },
        { stepNumber: 3, name: 'หน่วยงานตัวแทนเช่าเพิ่มพูน', description: 'ประสานงานกับหน่วยงานเกี่ยวกับการเช่าเพิ่ม' },
        { stepNumber: 4, name: 'ผมยอด EPC ทำเร็จ', description: 'บริษัท EPC ทำการติดตั้งเสร็จสิ้น' },
        { stepNumber: 5, name: 'ทำจมายานากผินเฟ้นอ', description: 'ตรวจสอบและทำการทดสอบระบบ (⚠️ ถ้าไม่ผ่านเกณฑ์ต้องปฏิเสธงาน)' },
        { stepNumber: 6, name: 'ลงทะเบียนกับการไฟบันปงา', description: 'ลงทะเบียนระบบกับการไฟฟ้า' },
        { stepNumber: 7, name: 'สัญญาจ้าง EPC', description: 'ทำสัญญาจ้างกับบริษัท EPC' },
        { stepNumber: 8, name: 'PPA เป็น PO ให้ EPC', description: 'ออก Purchase Order ให้ EPC' },
        { stepNumber: 9, name: 'ผมจมายากผทขสกระทบอ 0.1', description: 'ตรวจสอบสัญญากระทรวง ครั้งที่ 1' },
        { stepNumber: 10, name: 'ลงทะเบียนอมมนยขงกว์', description: 'ลงทะเบียนกับกรมพลังงาน' },
        { stepNumber: 11, name: 'EPC ติดตั้งปุทขณว์', description: 'EPC ติดตั้งระบบตรวจวัดและควบคุม' },
        { stepNumber: 12, name: 'ตกจริงงาน', description: 'ตรวจรับงานจากบริษัท EPC' },
        { stepNumber: 13, name: 'ปักผริการการที่ 1', description: 'การบำรุงรักษาครั้งที่ 1 (6 เดือน)' },
        { stepNumber: 14, name: 'ปักผริการการที่ 2', description: 'การบำรุงรักษาครั้งที่ 2 (12 เดือน)' },
        { stepNumber: 15, name: 'ปักผริการการที่ 3', description: 'การบำรุงรักษาครั้งที่ 3 (18 เดือน)' },
        { stepNumber: 16, name: 'ปักผริการการที่ 4', description: 'การบำรุงรักษาครั้งที่ 4 (24 เดือน)' }
      ];

      // Insert default steps
      const insertPromises = defaultSteps.map(step => 
        pool.execute(
          `INSERT INTO project_steps (projectId, stepNumber, name, description, status) 
           VALUES (?, ?, ?, ?, 'pending')`,
          [projectId, step.stepNumber, step.name, step.description]
        )
      );

      await Promise.all(insertPromises);

      // Fetch the newly created steps
      const [newSteps] = await pool.execute(
        `SELECT * FROM project_steps 
         WHERE projectId = ? 
         ORDER BY stepNumber ASC`,
        [projectId]
      );

      return res.json({
        success: true,
        data: newSteps
      });
    }

    res.json({
      success: true,
      data: steps
    });

  } catch (error) {
    console.error('Get project steps error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลขั้นตอน'
    });
  }
});

// Update project step
router.put('/:projectId/:stepId', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pool = getPool();
    const { projectId, stepId } = req.params;
    const { startDate, endDate, notes, status } = req.body;

    // Check if step exists
    const [steps] = await pool.execute(
      'SELECT * FROM project_steps WHERE id = ? AND projectId = ?',
      [stepId, projectId]
    );

    if (steps.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบขั้นตอนนี้'
      });
    }

    // Convert undefined to null for SQL compatibility
    const safeValue = (val) => val === undefined ? null : val;

    // Update step
    await pool.execute(
      `UPDATE project_steps SET
        startDate = COALESCE(?, startDate),
        endDate = COALESCE(?, endDate),
        notes = COALESCE(?, notes),
        status = COALESCE(?, status),
        updatedAt = NOW()
      WHERE id = ? AND projectId = ?`,
      [safeValue(startDate), safeValue(endDate), safeValue(notes), 
       safeValue(status), stepId, projectId]
    );

    // Get updated step
    const [updatedSteps] = await pool.execute(
      'SELECT * FROM project_steps WHERE id = ? AND projectId = ?',
      [stepId, projectId]
    );

    res.json({
      success: true,
      message: 'อัพเดทขั้นตอนสำเร็จ',
      data: updatedSteps[0]
    });

  } catch (error) {
    console.error('Update project step error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการอัพเดทขั้นตอน'
    });
  }
});

// Upload evidence for a step (Multiple files support)
router.post('/:projectId/:stepId/upload', 
  authenticateToken, 
  authorizeRole('admin'),
  upload.array('documents', 20), // รองรับสูงสุด 20 ไฟล์
  async (req, res) => {
    try {
      const pool = getPool();
      const { projectId, stepId } = req.params;
      const { startDate, endDate, notes } = req.body;

      // Check if step exists
      const [steps] = await pool.execute(
        'SELECT * FROM project_steps WHERE id = ? AND projectId = ?',
        [stepId, projectId]
      );

      if (steps.length === 0) {
        // Delete uploaded files if step not found
        if (req.files && req.files.length > 0) {
          req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
        return res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'ไม่พบขั้นตอนนี้'
        });
      }

      // Get existing documents (don't delete, keep them)
      let existingDocs = [];
      if (steps[0].documentPath) {
        try {
          const parsed = JSON.parse(steps[0].documentPath) || [];
          // Filter out null values and ensure each item is an object with path
          existingDocs = Array.isArray(parsed) 
            ? parsed.filter(doc => doc && typeof doc === 'object' && doc.path)
            : [];
        } catch (e) {
          // If old format (string), convert to array
          if (steps[0].documentPath) {
            existingDocs = [{ 
              path: steps[0].documentPath, 
              name: steps[0].documentName || 'document' 
            }];
          }
        }
      }

      // Add new uploaded files to existing documents
      if (req.files && req.files.length > 0) {
        const newDocs = req.files.map(file => ({
          path: `/uploads/project-steps/${file.filename}`,
          name: file.originalname,
          size: file.size,
          uploadedAt: new Date().toISOString()
        }));
        existingDocs = [...existingDocs, ...newDocs];
      }

      // Convert to JSON string - filter out any null/undefined values
      const documentPathJson = JSON.stringify(existingDocs.filter(d => d && d.path).map(d => d.path));
      const documentNameJson = JSON.stringify(existingDocs.filter(d => d && d.name).map(d => d.name));

      // Convert undefined to null for SQL compatibility
      const safeValue = (val) => val === undefined ? null : val;

      // Update step with documents and other fields
      await pool.execute(
        `UPDATE project_steps SET
          startDate = COALESCE(?, startDate),
          endDate = COALESCE(?, endDate),
          notes = COALESCE(?, notes),
          documentPath = ?,
          documentName = ?,
          status = 'completed',
          updatedAt = NOW()
        WHERE id = ? AND projectId = ?`,
        [safeValue(startDate), safeValue(endDate), safeValue(notes), 
         documentPathJson, documentNameJson, stepId, projectId]
      );

      // Get updated step
      const [updatedSteps] = await pool.execute(
        'SELECT * FROM project_steps WHERE id = ? AND projectId = ?',
        [stepId, projectId]
      );

      res.json({
        success: true,
        message: `อัพโหลดหลักฐานสำเร็จ (${req.files?.length || 0} ไฟล์)`,
        data: updatedSteps[0],
        filesUploaded: req.files?.length || 0,
        totalFiles: existingDocs.length
      });

    } catch (error) {
      // Delete uploaded files on error
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      console.error('Upload evidence error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: error.message || 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์'
      });
    }
  }
);

// Download evidence file
router.get('/:projectId/:stepId/download', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const { projectId, stepId } = req.params;

    // Get step with document
    const [steps] = await pool.execute(
      'SELECT * FROM project_steps WHERE id = ? AND projectId = ?',
      [stepId, projectId]
    );

    if (steps.length === 0 || !steps[0].documentPath) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไม่พบไฟล์เอกสาร'
      });
    }

    const filePath = path.join(__dirname, '..', steps[0].documentPath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'ไฟล์ไม่พบในระบบ'
      });
    }

    res.download(filePath, steps[0].documentName || 'document');

  } catch (error) {
    console.error('Download evidence error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์'
    });
  }
});

module.exports = router;


