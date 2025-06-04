const express = require('express');
const {
  submitTaskerForm,
  getAllTaskers,
  approveTasker,
  rejectTasker,
  getTaskerProfile,
  getAllApprovedTaskers,
  getTaskersWithFullInfo,
  setTaskerRate,
  setTaskerPending,
  getProfilePicture,           // ✅ New file-serving endpoints
  getProofOfAddress,
  getMedicalCertificate,
  getOptionalCertificate,
  getClearance,
  getTaskersByEmail
} = require('../controllers/taskerController');

const router = express.Router();

// ✅ Existing routes
router.post('/submit', submitTaskerForm);
router.get('/', getAllTaskers);
router.get('/approved', getAllApprovedTaskers);
router.get('/fullinfo', getTaskersWithFullInfo);
router.put('/approve/:id', approveTasker);
router.put('/reject/:id', rejectTasker);
router.get('/:id', getTaskerProfile);
router.put('/rate/:id', setTaskerRate);
router.put('/pending/:id', setTaskerPending);

// ✅ New file-serving routes
router.get('/:id/profile-picture', getProfilePicture);
router.get('/:id/proof-of-address', getProofOfAddress);
router.get('/:id/medical-certificate', getMedicalCertificate);
router.get('/:id/optional-certificate', getOptionalCertificate);
router.get('/:id/clearance', getClearance);

router.get('/byemail/:email', getTaskersByEmail);


module.exports = router;
