const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/admin');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `admin-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit for large files including videos
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-msvideo',
      'video/webm'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, GIF, WEBP) และวิดีโอ (MP4, MPEG, MOV, AVI, WEBM) เท่านั้น'), false);
    }
  }
});

// @route   POST /api/admin/uploads/image
// @desc    Upload image or video file
// @access  Private (Admin only)
router.post('/image', authenticateToken, authorizeRole('admin', 'super-admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'ไม่พบไฟล์ที่ต้องการอัปโหลด'
      });
    }

    // Return file URL
    const fileUrl = `/uploads/admin/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'อัปโหลดไฟล์สำเร็จ',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
      error: error.message
    });
  }
});

// @route   POST /api/admin/uploads/multiple
// @desc    Upload multiple files (images/videos)
// @access  Private (Admin only)
router.post('/multiple', authenticateToken, authorizeRole('admin', 'super-admin'), upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ไม่พบไฟล์ที่ต้องการอัปโหลด'
      });
    }

    // Return array of file URLs
    const files = req.files.map(file => ({
      url: `/uploads/admin/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({
      success: true,
      message: `อัปโหลดไฟล์สำเร็จ ${files.length} ไฟล์`,
      data: files
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/uploads/:filename
// @desc    Delete uploaded file
// @access  Private (Admin only)
router.delete('/:filename', authenticateToken, authorizeRole('admin', 'super-admin'), async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/admin', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบไฟล์ที่ต้องการลบ'
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'ลบไฟล์สำเร็จ'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลบไฟล์',
      error: error.message
    });
  }
});

module.exports = router;


