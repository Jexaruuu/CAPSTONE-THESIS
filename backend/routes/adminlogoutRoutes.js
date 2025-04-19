// routes/adminlogoutRoutes.js
const express = require("express");
const router = express.Router();
const { adminLogout } = require("../controllers/adminlogoutController");

router.post("/logout", adminLogout);

module.exports = router;