-- Migration: เพิ่ม fields สำหรับข้อมูลอุปกรณ์และ kWp
-- Date: 2025-01-12
-- Description: เพิ่ม equipmentData, summaryData, kWpData ใน project_registrations table

USE eep_management;

-- เพิ่ม columns สำหรับเก็บข้อมูลตาราง (JSON format)
ALTER TABLE project_registrations 
  ADD COLUMN IF NOT EXISTS equipmentData TEXT NULL COMMENT 'JSON: ข้อมูลอุปกรณ์ 12 แถว [id, quantity, cost]',
  ADD COLUMN IF NOT EXISTS summaryData TEXT NULL COMMENT 'JSON: ข้อมูลสรุป {totalQuantity, totalCost, additionalQuantity, additionalCost}',
  ADD COLUMN IF NOT EXISTS kWpData TEXT NULL COMMENT 'JSON: ข้อมูล kWp {estimate100, estimate70, actual}';

-- แสดงผลลัพธ์
SELECT 'Added equipmentData, summaryData, kWpData fields to project_registrations table' AS Result;


