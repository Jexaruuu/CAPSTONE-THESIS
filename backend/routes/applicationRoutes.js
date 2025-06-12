const express = require("express");
const router = express.Router();
const {
  submitApplication,
  getAllApplicants,
  getServiceRequestApplicants,
  updateApplicantStatus
} = require("../controllers/applicationController");

router.post("/submit-application", submitApplication);
router.get("/", getAllApplicants);

// ✅ NEW
router.get("/service-request-applicants", getServiceRequestApplicants);
router.put("/service-request-applicants/:id/status", updateApplicantStatus);

module.exports = router;
