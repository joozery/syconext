-- Create document_versions table for tracking document edit history
CREATE TABLE IF NOT EXISTS document_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  version_number INT NOT NULL,
  document_number VARCHAR(50) NOT NULL,
  original_data JSON NOT NULL,
  edited_data JSON NOT NULL,
  edited_by VARCHAR(100) NOT NULL,
  edit_reason TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES project_registrations(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_version_number (version_number),
  INDEX idx_document_number (document_number),
  INDEX idx_created_at (createdAt),
  UNIQUE KEY unique_project_version (project_id, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

