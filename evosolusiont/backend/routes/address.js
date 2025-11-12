const express = require('express');
const axios = require('axios');
const router = express.Router();

// Base URL for Thai address data
const BASE_URL = 'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_';

// @route   GET /api/address/provinces
// @desc    Get all provinces
// @access  Public
router.get('/provinces', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}province.json`);
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลจังหวัดได้'
    });
  }
});

// @route   GET /api/address/amphures/:provinceId
// @desc    Get districts by province ID
// @access  Public
router.get('/amphures/:provinceId', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}amphure.json`);
    const filtered = response.data.filter(
      item => item.province_id === parseInt(req.params.provinceId)
    );
    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลอำเภอได้'
    });
  }
});

// @route   GET /api/address/tambons/:amphureId
// @desc    Get sub-districts by district ID
// @access  Public
router.get('/tambons/:amphureId', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}tambon.json`);
    const filtered = response.data.filter(
      item => item.amphure_id === parseInt(req.params.amphureId)
    );
    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    console.error('Error fetching sub-districts:', error);
    res.status(500).json({
      success: false,
      message: 'ไม่สามารถดึงข้อมูลตำบลได้'
    });
  }
});

module.exports = router;


