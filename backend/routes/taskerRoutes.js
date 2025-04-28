const express = require('express');
const { 
  submitTaskerForm, 
  getAllTaskers, 
  approveTasker, 
  rejectTasker,
  getTaskerProfile,
  getAllApprovedTaskers,
  getTaskersWithFullInfo // ✅ import it
} = require('../controllers/taskerController');

const router = express.Router();

router.post('/submit', submitTaskerForm);
router.get('/', getAllTaskers);
router.get('/approved', getAllApprovedTaskers);
router.get('/fullinfo', getTaskersWithFullInfo); // ✅ added new route
router.put('/approve/:id', approveTasker);
router.delete('/reject/:id', rejectTasker);
router.get('/:id', getTaskerProfile);

module.exports = router;
