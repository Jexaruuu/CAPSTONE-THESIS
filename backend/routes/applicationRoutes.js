const express = require("express");
const router = express.Router();
const {
  submitApplication,
  getAllApplicants,
  getServiceRequestApplicants,
  updateApplicantStatus,
  getApprovedApplicants
} = require("../controllers/applicationController");

router.post("/submit-application", submitApplication);

router.get("/", getAllApplicants);

router.get("/service-request-applicants", getServiceRequestApplicants);

router.put("/service-request-applicants/:id/status", updateApplicantStatus);

router.get("/approved", getApprovedApplicants); 

module.exports = router;
