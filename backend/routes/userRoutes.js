// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ✅ Profile Picture Upload
router.put('/user/profile-picture/:id', userController.uploadProfilePicture, userController.updateProfilePicture);

// ✅ Existing Routes
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/update/:id', userController.updateInfo);
router.put('/user/update-password/:id', userController.updatePassword);

// ✅ NEW - Fetch all users
router.get('/users', userController.getAllUsers);

// ✅ NEW - Fetch single user by ID for View Profile
router.get('/users/:id', userController.getUserById);

module.exports = router;
