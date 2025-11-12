-- Create project_steps table for tracking 16 project steps
CREATE TABLE IF NOT EXISTS project_steps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  projectId INT NOT NULL,
  stepNumber INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  startDate DATE NULL,
  endDate DATE NULL,
  documentPath VARCHAR(500) NULL,
  documentName VARCHAR(255) NULL,
  notes TEXT NULL,
  status ENUM('pending', 'in-progress', 'completed', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (projectId) REFERENCES project_registrations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_step (projectId, stepNumber),
  INDEX idx_project_id (projectId),
  INDEX idx_step_number (stepNumber),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


