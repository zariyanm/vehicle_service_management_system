// ============================================
// API Routes - All using Stored Procedures
// ============================================
const express = require('express');
const router = express.Router();
const db = require('./db');

// ============================================
// 1. Add New Service
// POST /api/services
// ============================================
router.post('/services', async (req, res) => {
    try {
        const { vehicle_no, owner_name, service_type, service_date, next_service_date, cost, remarks } = req.body;

        // Validation
        if (!vehicle_no || !owner_name || !service_type || !service_date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vehicle number, owner name, service type, and service date are required' 
            });
        }

        // Call stored procedure
        const [results] = await db.query(
            'CALL sp_add_service(?, ?, ?, ?, ?, ?, ?)',
            [vehicle_no, owner_name, service_type, service_date, next_service_date || null, cost || null, remarks || null]
        );

        res.status(201).json({
            success: true,
            message: 'Service added successfully',
            data: results[0][0]
        });

    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add service',
            error: error.message
        });
    }
});

// ============================================
// 2. Get All Services
// GET /api/services
// ============================================
router.get('/services', async (req, res) => {
    try {
        // Call stored procedure
        const [results] = await db.query('CALL sp_get_all_services()');

        res.status(200).json({
            success: true,
            data: results[0]
        });

    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message
        });
    }
});

// ============================================
// 3. Search Service by Vehicle Number
// GET /api/services/search/:vehicle_no
// ============================================
router.get('/services/search/:vehicle_no', async (req, res) => {
    try {
        const { vehicle_no } = req.params;

        if (!vehicle_no) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle number is required'
            });
        }

        // Call stored procedure
        const [results] = await db.query('CALL sp_search_service(?)', [vehicle_no]);

        res.status(200).json({
            success: true,
            data: results[0]
        });

    } catch (error) {
        console.error('Error searching service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search service',
            error: error.message
        });
    }
});

// ============================================
// 4. Update Service
// PUT /api/services/:id
// ============================================
router.put('/services/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { vehicle_no, owner_name, service_type, service_date, next_service_date, cost, remarks } = req.body;

        // Validation
        if (!vehicle_no || !owner_name || !service_type || !service_date) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle number, owner name, service type, and service date are required'
            });
        }

        // Call stored procedure
        const [results] = await db.query(
            'CALL sp_update_service(?, ?, ?, ?, ?, ?, ?, ?)',
            [id, vehicle_no, owner_name, service_type, service_date, next_service_date || null, cost || null, remarks || null]
        );

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: results[0][0]
        });

    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update service',
            error: error.message
        });
    }
});

// ============================================
// 5. Delete Service
// DELETE /api/services/:id
// ============================================
router.delete('/services/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Service ID is required'
            });
        }

        // Call stored procedure
        const [results] = await db.query('CALL sp_delete_service(?)', [id]);

        if (results[0][0].deleted_rows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete service',
            error: error.message
        });
    }
});

module.exports = router;