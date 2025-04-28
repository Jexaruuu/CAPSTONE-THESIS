const express = require('express');
const { 
  submitTaskerForm, 
  getAllTaskers, 
  approveTasker, 
  rejectTasker,
  getTaskerProfile,
  getAllApprovedTaskers // ✅ New controller imported
} = require('../controllers/taskerController');

const router = express.Router();

router.post('/submit', submitTaskerForm);
router.get('/', getAllTaskers);
router.get('/approved', getAllApprovedTaskers); // ✅ New route for approved full taskers
router.put('/approve/:id', approveTasker);
router.put('/reject/:id', rejectTasker);
router.get('/:id', getTaskerProfile);

module.exports = router;
