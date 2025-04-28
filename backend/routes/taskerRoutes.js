const express = require('express');
const { submitTaskerForm, getAllTaskers, approveTasker, rejectTasker } = require('../controllers/taskerController');
const router = express.Router();

router.post('/submit', submitTaskerForm);
router.get('/', getAllTaskers);
router.put('/approve/:id', approveTasker);
router.put('/reject/:id', rejectTasker);

module.exports = router;
