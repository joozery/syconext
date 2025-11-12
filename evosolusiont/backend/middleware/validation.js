// Validation middleware

const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Attach to request
  req.pagination = {
    page,
    limit,
    offset
  };

  next();
};

const validateProject = (req, res, next) => {
  const { agencyName, coordinatorId } = req.body;

  if (!agencyName || !coordinatorId) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
    });
  }

  next();
};

const validateCoordinator = (req, res, next) => {
  const { fullName, idCardNumber, phone } = req.body;

  if (!fullName || !idCardNumber || !phone) {
    return res.status(400).json({
      success: false,
      message: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ-นามสกุล, เลขบัตรประชาชน, เบอร์โทรศัพท์)'
    });
  }

  // Validate ID card number format (13 digits)
  if (!/^\d{13}$/.test(idCardNumber)) {
    return res.status(400).json({
      success: false,
      message: 'เลขบัตรประชาชนไม่ถูกต้อง (ต้องเป็นตัวเลข 13 หลัก)'
    });
  }

  // Validate phone number format (10 digits)
  if (!/^\d{10}$/.test(phone.replace(/-/g, ''))) {
    return res.status(400).json({
      success: false,
      message: 'เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)'
    });
  }

  next();
};

module.exports = {
  validatePagination,
  validateProject,
  validateCoordinator
};


