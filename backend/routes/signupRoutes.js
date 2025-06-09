const express = require('express');
const router = express.Router();
const { signup, verifyEmail } = require('../controllers/signupController'); 

router.post('/signup', signup);

// 🆕 Add this:
router.get('/verify-email', verifyEmail);

module.exports = router;
