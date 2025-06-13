const express = require("express");
const router = express.Router();
const {
  submitApplication,
  getAllApplicants,
  getServiceRequestApplicants,
  updateApplicantStatus,
  getApprovedApplicants // ✅ Add this import
} = require("../controllers/applicationController");

// ✅ Submit a new application
router.post("/submit-application", submitApplication);

// ✅ Get all applicants (basic info)
router.get("/", getAllApplicants);

// ✅ Get full service request applicants info
router.get("/service-request-applicants", getServiceRequestApplicants);

// ✅ Update application status (approve, reject, pending)
router.put("/service-request-applicants/:id/status", updateApplicantStatus);

// ✅ Get approved applicants for a client's service requests
router.get("/approved", getApprovedApplicants); 

module.exports = router;
