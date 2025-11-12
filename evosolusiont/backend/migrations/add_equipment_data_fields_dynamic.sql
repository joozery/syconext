-- Migration: เพิ่ม fields สำหรับข้อมูลอุปกรณ์และ kWp
-- Date: 2025-01-12
-- Description: เพิ่ม equipmentData, summaryData, kWpData ใน project_registrations table
-- Compatible with older MySQL versions

USE eep_management;

-- Add equipmentData column
SET @dbname = DATABASE();
SET @tablename = 'project_registrations';
SET @columnname = 'equipmentData';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT ''Column equipmentData already exists'' AS Result;',
  'ALTER TABLE project_registrations ADD COLUMN equipmentData TEXT NULL COMMENT ''JSON: ข้อมูลอุปกรณ์ 12 แถว'';'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add summaryData column
SET @columnname = 'summaryData';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT ''Column summaryData already exists'' AS Result;',
  'ALTER TABLE project_registrations ADD COLUMN summaryData TEXT NULL COMMENT ''JSON: ข้อมูลสรุป'';'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add kWpData column
SET @columnname = 'kWpData';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT ''Column kWpData already exists'' AS Result;',
  'ALTER TABLE project_registrations ADD COLUMN kWpData TEXT NULL COMMENT ''JSON: ข้อมูล kWp'';'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SELECT 'Migration completed: Added equipmentData, summaryData, kWpData fields' AS Result;


