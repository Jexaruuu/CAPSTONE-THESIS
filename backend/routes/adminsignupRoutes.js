// routes/adminsignupRoutes.js
const express = require('express');
const router = express.Router();
const { adminSignup } = require('../controllers/adminsignupController');

router.post('/adminsignup', adminSignup);

module.exports = router;