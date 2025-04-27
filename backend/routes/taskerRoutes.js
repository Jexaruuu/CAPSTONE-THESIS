const express = require('express');
const { submitTaskerForm } = require('../controllers/taskerController');
const router = express.Router();

router.post('/submit', submitTaskerForm);

module.exports = router;
