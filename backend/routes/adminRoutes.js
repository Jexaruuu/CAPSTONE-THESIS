// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAdminProfile } = require("../controllers/adminController");

router.get("/admin", getAdminProfile);

module.exports = router;
