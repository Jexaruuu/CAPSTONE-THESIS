const express = require('express');
const { 
  submitTaskerForm, 
  getAllTaskers, 
  approveTasker, 
  rejectTasker,
  getTaskerProfile,
  getAllApprovedTaskers
} = require('../controllers/taskerController');

const router = express.Router();

router.post('/submit', submitTaskerForm);
router.get('/', getAllTaskers);
router.get('/approved', getAllApprovedTaskers);
router.put('/approve/:id', approveTasker);

// ✅ Change from PUT to DELETE for rejecting (because we are deleting data)
router.delete('/reject/:id', rejectTasker);

router.get('/:id', getTaskerProfile);

module.exports = router;
