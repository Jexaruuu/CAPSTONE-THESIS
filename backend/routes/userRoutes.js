// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Existing routes
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/update/:id', userController.updateInfo);

// Add this new route for password updates
router.put('/api/user/update-password/:id', userController.updatePassword);

module.exports = router;