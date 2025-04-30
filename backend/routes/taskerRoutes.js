const express = require('express');
const { 
  submitTaskerForm, 
  getAllTaskers, 
  approveTasker, 
  rejectTasker,
  getTaskerProfile,
  getAllApprovedTaskers,
  getTaskersWithFullInfo,
  setTaskerRate // ✅ Import new controller
} = require('../controllers/taskerController');

const router = express.Router();

router.post('/submit', submitTaskerForm);
router.get('/', getAllTaskers);
router.get('/approved', getAllApprovedTaskers);
router.get('/fullinfo', getTaskersWithFullInfo);
router.put('/approve/:id', approveTasker);
router.put('/reject/:id', rejectTasker); // 🔥 Important: now it's PUT, not DELETE
router.get('/:id', getTaskerProfile);
router.put('/rate/:id', setTaskerRate); // ✅ New route for setting hourly rate

module.exports = router;
