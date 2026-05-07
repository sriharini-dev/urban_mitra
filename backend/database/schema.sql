CREATE DATABASE IF NOT EXISTS work_zone;
USE work_zone;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'helper', 'admin') NOT NULL,
  status ENUM('active', 'pending', 'blocked') NOT NULL DEFAULT 'active',
  address_line VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS helper_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  gender VARCHAR(20) NOT NULL,
  date_of_birth DATE NOT NULL,
  skills JSON NOT NULL,
  experience_years INT NOT NULL DEFAULT 0,
  availability VARCHAR(50) NOT NULL,
  id_proof_type VARCHAR(50) NOT NULL,
  id_proof_number VARCHAR(100) NOT NULL,
  about TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_helper_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INT NOT NULL,
  visits_per_month INT NOT NULL,
  features JSON NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  helper_id INT NULL,
  plan_id INT NOT NULL,
  service_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  notes TEXT NULL,
  address_line VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  status ENUM('pending', 'confirmed', 'assigned', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_booking_helper
    FOREIGN KEY (helper_id) REFERENCES users(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_booking_plan
    FOREIGN KEY (plan_id) REFERENCES plans(id)
    ON DELETE RESTRICT
);
