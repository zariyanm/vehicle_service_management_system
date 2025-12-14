-- ============================================
-- Vehicle Service Management System
-- Database Schema & Stored Procedures
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS vehicle_service_db;
USE vehicle_service_db;

-- ============================================
-- Table: vehicle_service
-- ============================================
CREATE TABLE IF NOT EXISTS vehicle_service (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_no VARCHAR(50) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    service_date DATE NOT NULL,
    next_service_date DATE,
    cost DECIMAL(10, 2),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Stored Procedure 1: Add New Service
-- ============================================
DELIMITER //
CREATE PROCEDURE sp_add_service(
    IN p_vehicle_no VARCHAR(50),
    IN p_owner_name VARCHAR(100),
    IN p_service_type VARCHAR(100),
    IN p_service_date DATE,
    IN p_next_service_date DATE,
    IN p_cost DECIMAL(10, 2),
    IN p_remarks TEXT
)
BEGIN
    INSERT INTO vehicle_service (
        vehicle_no, 
        owner_name, 
        service_type, 
        service_date, 
        next_service_date, 
        cost, 
        remarks
    ) VALUES (
        p_vehicle_no, 
        p_owner_name, 
        p_service_type, 
        p_service_date, 
        p_next_service_date, 
        p_cost, 
        p_remarks
    );
    
    -- Return the newly created service
    SELECT * FROM vehicle_service WHERE service_id = LAST_INSERT_ID();
END //
DELIMITER ;

-- ============================================
-- Stored Procedure 2: Get All Services
-- ============================================
DELIMITER //
CREATE PROCEDURE sp_get_all_services()
BEGIN
    SELECT 
        service_id,
        vehicle_no,
        owner_name,
        service_type,
        service_date,
        next_service_date,
        cost,
        remarks
    FROM vehicle_service
    ORDER BY service_date DESC;
END //
DELIMITER ;

-- ============================================
-- Stored Procedure 3: Search Service by Vehicle Number
-- ============================================
DELIMITER //
CREATE PROCEDURE sp_search_service(
    IN p_vehicle_no VARCHAR(50)
)
BEGIN
    SELECT 
        service_id,
        vehicle_no,
        owner_name,
        service_type,
        service_date,
        next_service_date,
        cost,
        remarks
    FROM vehicle_service
    WHERE vehicle_no LIKE CONCAT('%', p_vehicle_no, '%')
    ORDER BY service_date DESC;
END //
DELIMITER ;

-- ============================================
-- Stored Procedure 4: Update Service
-- ============================================
DELIMITER //
CREATE PROCEDURE sp_update_service(
    IN p_service_id INT,
    IN p_vehicle_no VARCHAR(50),
    IN p_owner_name VARCHAR(100),
    IN p_service_type VARCHAR(100),
    IN p_service_date DATE,
    IN p_next_service_date DATE,
    IN p_cost DECIMAL(10, 2),
    IN p_remarks TEXT
)
BEGIN
    UPDATE vehicle_service
    SET 
        vehicle_no = p_vehicle_no,
        owner_name = p_owner_name,
        service_type = p_service_type,
        service_date = p_service_date,
        next_service_date = p_next_service_date,
        cost = p_cost,
        remarks = p_remarks
    WHERE service_id = p_service_id;
    
    -- Return updated record
    SELECT * FROM vehicle_service WHERE service_id = p_service_id;
END //
DELIMITER ;

-- ============================================
-- Stored Procedure 5: Delete Service
-- ============================================
DELIMITER //
CREATE PROCEDURE sp_delete_service(
    IN p_service_id INT
)
BEGIN
    DELETE FROM vehicle_service WHERE service_id = p_service_id;
    SELECT ROW_COUNT() as deleted_rows;
END //
DELIMITER ;

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================
INSERT INTO vehicle_service (vehicle_no, owner_name, service_type, service_date, next_service_date, cost, remarks)
VALUES 
    ('MH-12-AB-1234', 'Rajesh Kumar', 'Oil Change', '2024-12-01', '2025-03-01', 1500.00, 'Regular maintenance'),
    ('DL-10-CD-5678', 'Priya Sharma', 'Brake Service', '2024-12-05', '2025-06-05', 3500.00, 'Brake pads replaced'),
    ('KA-05-EF-9012', 'Amit Patel', 'Full Service', '2024-12-10', '2025-12-10', 8000.00, 'Complete vehicle checkup');