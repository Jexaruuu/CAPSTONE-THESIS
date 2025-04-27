// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin routes
router.get('/admin/:id', adminController.getAdminProfile);
router.put('/admin/update/:id', adminController.updateAdminInfo);
router.put('/admin/update-password/:id', adminController.updateAdminPassword);
router.get('/count/count', adminController.countUserAndAdmin);

// ✅ NEW - Fetch all admins
router.get('/admins', adminController.getAllAdmins);

// ✅ NEW - Delete admin
router.delete('/admin/:id', adminController.deleteAdmin);

// ✅ NEW - Fetch single admin by ID for View Profile (already EXISTING! ✅)
router.get('/admins/:id', adminController.getAdminById);

module.exports = router;
