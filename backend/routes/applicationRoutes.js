const express = require("express");
const router = express.Router();
const { submitApplication, getAllApplicants } = require("../controllers/applicationController");

router.post("/submit-application", submitApplication); // ✅ must match this
router.get("/", getAllApplicants);

module.exports = router;