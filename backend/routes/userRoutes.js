// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Existing routes
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/update/:id', userController.updateInfo);
router.put('/user/update-password/:id', userController.updatePassword);

// Auth
router.post('/admin/signup', adminController.signup);
router.post('/admin/login', adminController.login);
router.get('/admin/logout', adminController.logout);

// Admin CRUD (optional)
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;