CREATE DATABASE IF NOT EXISTS careerhub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE careerhub_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  company VARCHAR(160) NOT NULL,
  location VARCHAR(160) NOT NULL,
  job_type VARCHAR(80) NOT NULL,
  salary VARCHAR(100) DEFAULT NULL,
  description TEXT NOT NULL,
  requirements TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_saved_job (user_id, job_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  job_id INT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  cover_letter TEXT DEFAULT NULL,
  cv_path VARCHAR(255) DEFAULT NULL,
  status ENUM('Pending','Reviewed','Accepted','Rejected') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_application (user_id, job_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- After registering your own account, make it admin using its email:
-- UPDATE users SET role='admin' WHERE email='your@email.com';

-- Sample jobs for first-time setup
INSERT INTO jobs (title, company, location, job_type, salary, description, requirements)
SELECT 'Frontend Developer', 'Tech Solutions', 'Beirut, Lebanon', 'Full Time', '$900 - $1200',
       'Develop and maintain responsive web applications using React.',
       'Basic React, JavaScript, HTML and CSS knowledge.'
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Frontend Developer' AND company = 'Tech Solutions');

INSERT INTO jobs (title, company, location, job_type, salary, description, requirements)
SELECT 'Backend Developer', 'Digital Systems', 'Tripoli, Lebanon', 'Full Time', '$1000 - $1400',
       'Build APIs and connect web applications with MySQL databases.',
       'Node.js, Express and MySQL knowledge.'
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'Backend Developer' AND company = 'Digital Systems');

INSERT INTO jobs (title, company, location, job_type, salary, description, requirements)
SELECT 'UI UX Designer', 'Creative Agency', 'Remote', 'Part Time', '$600 - $900',
       'Design simple and user-friendly interfaces for websites.',
       'Figma and basic UI UX principles.'
WHERE NOT EXISTS (SELECT 1 FROM jobs WHERE title = 'UI UX Designer' AND company = 'Creative Agency');
