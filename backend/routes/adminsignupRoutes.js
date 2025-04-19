// routes/adminsignupRoutes.js
const express = require('express');
const router = express.Router();
const { adminSignup } = require('../controllers/adminsignupController');

// Update this to match frontend route
router.post('/adminsignup', adminSignup);

module.exports = router;
