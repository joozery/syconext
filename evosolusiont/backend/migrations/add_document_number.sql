-- Add document number field to project_registrations table
ALTER TABLE project_registrations 
ADD COLUMN documentNumber VARCHAR(50) UNIQUE AFTER id,
ADD INDEX idx_documentNumber (documentNumber);

-- Create document_numbers table for tracking sequential numbers
CREATE TABLE IF NOT EXISTS document_numbers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prefix VARCHAR(20) NOT NULL DEFAULT 'ชร',
  year INT NOT NULL,
  last_number INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_prefix_year (prefix, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert initial data for year 2568
INSERT INTO document_numbers (prefix, year, last_number) 
VALUES ('ชร', 2568, 0)
ON DUPLICATE KEY UPDATE last_number = last_number;

