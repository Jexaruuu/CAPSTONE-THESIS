// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin routes
router.get('/admin/:id', adminController.getAdminProfile);  // Get admin profile
router.put('/admin/update/:id', adminController.updateAdminInfo);  // Update admin profile info
router.put('/admin/update-password/:id', adminController.updateAdminPassword);  // Update admin password

module.exports = router;
