-- Migration: Update project_steps table to support multiple files
-- Change documentPath and documentName from VARCHAR to JSON to store arrays

-- Backup existing data first (optional, for safety)
-- CREATE TABLE project_steps_backup AS SELECT * FROM project_steps WHERE documentPath IS NOT NULL;

-- Modify columns to TEXT type (can store JSON)
ALTER TABLE project_steps 
  MODIFY COLUMN documentPath TEXT NULL COMMENT 'JSON array of file paths',
  MODIFY COLUMN documentName TEXT NULL COMMENT 'JSON array of file names';

-- Note: Existing data will remain as strings. The backend code handles conversion
-- from old format (string) to new format (JSON array) automatically.

-- Optional: Convert existing single-file data to JSON array format
-- Warning: Run this ONLY ONCE and test on backup first!
/*
UPDATE project_steps 
SET 
  documentPath = CONCAT('["', documentPath, '"]'),
  documentName = CONCAT('["', documentName, '"]')
WHERE 
  documentPath IS NOT NULL 
  AND documentPath != ''
  AND documentPath NOT LIKE '[%'  -- Skip if already JSON
  AND JSON_VALID(documentPath) = 0;  -- Skip if already valid JSON
*/

-- Verify the changes
SELECT COUNT(*) as total_steps_with_documents 
FROM project_steps 
WHERE documentPath IS NOT NULL AND documentPath != '';

-- Show example of data format
SELECT 
  id, 
  projectId, 
  stepNumber, 
  documentPath, 
  documentName,
  status 
FROM project_steps 
WHERE documentPath IS NOT NULL 
LIMIT 5;


