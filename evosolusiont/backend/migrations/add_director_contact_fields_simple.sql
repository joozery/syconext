-- Add directorPhone and directorEmail columns to project_registrations table
-- Run this migration if you get an error about these columns not existing

USE eep_management;

ALTER TABLE project_registrations 
  ADD COLUMN IF NOT EXISTS directorPhone VARCHAR(20) NULL AFTER directorName,
  ADD COLUMN IF NOT EXISTS directorEmail VARCHAR(100) NULL AFTER directorPhone;

-- Verify the changes
DESCRIBE project_registrations;

