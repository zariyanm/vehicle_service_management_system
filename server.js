// ============================================
// Vehicle Service Management System - Server
// ============================================
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const routes = require('./routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ============================================
// Routes
// ============================================
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Vehicle Service Management System API',
        version: '1.0.0',
        endpoints: {
            'GET /api/services': 'Get all services',
            'POST /api/services': 'Add new service',
            'GET /api/services/search/:vehicle_no': 'Search service by vehicle number',
            'PUT /api/services/:id': 'Update service',
            'DELETE /api/services/:id': 'Delete service'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚗 Vehicle Service Management System');
    console.log('========================================');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log('========================================');
});