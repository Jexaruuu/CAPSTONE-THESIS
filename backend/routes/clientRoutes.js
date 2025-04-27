const express = require('express');
const router = express.Router();
const { bookService } = require('../controllers/clientController'); // ✅ Correct controller

// router.use(fileUpload()); ❌ REMOVE this (already handled globally in server.js)

// Routes
router.post('/bookservice', bookService); // ✅

module.exports = router;
