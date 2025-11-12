-- Fix project_steps ID to match stepNumber for project 4
-- This will make ID sequential (1,2,3,4...16) matching stepNumber

USE eep_management;

-- Backup current data
CREATE TEMPORARY TABLE temp_project_steps_backup AS
SELECT * FROM project_steps WHERE projectId = 4;

-- Delete all steps for project 4
DELETE FROM project_steps WHERE projectId = 4;

-- Re-insert with correct IDs (id = stepNumber)
INSERT INTO project_steps (id, projectId, stepNumber, name, description, startDate, endDate, documentPath, documentName, notes, status, createdAt, updatedAt)
SELECT 
  stepNumber as id,  -- Use stepNumber as the new ID
  projectId,
  stepNumber,
  name,
  description,
  startDate,
  endDate,
  documentPath,
  documentName,
  notes,
  status,
  createdAt,
  NOW() as updatedAt
FROM temp_project_steps_backup
ORDER BY stepNumber ASC;

-- Drop temporary table
DROP TEMPORARY TABLE temp_project_steps_backup;

-- Verify the result
SELECT id, stepNumber, name, status, LEFT(documentName, 30) as doc 
FROM project_steps 
WHERE projectId = 4 
ORDER BY stepNumber ASC
LIMIT 10;

-- Show confirmation
SELECT CONCAT('Fixed ', COUNT(*), ' steps for project 4. ID now matches stepNumber.') AS Result
FROM project_steps
WHERE projectId = 4;


