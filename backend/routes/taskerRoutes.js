const express = require('express');
const { 
  submitTaskerForm, 
  getAllTaskers, 
  approveTasker, 
  rejectTasker,
  getTaskerProfile // ✅ Import new controller
} = require('../controllers/taskerController');

const router = express.Router();

router.post('/submit', submitTaskerForm);
router.get('/', getAllTaskers);
router.put('/approve/:id', approveTasker);
router.put('/reject/:id', rejectTasker);

// 🔥 NEW Route to get FULL tasker profile
router.get('/:id', getTaskerProfile);

module.exports = router;
