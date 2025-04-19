// routes/adminloginRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/adminloginController');

// Admin login route - changed from /login to /adminlogin
router.post('/adminlogin', adminLogin);


module.exports = router;
