// controllers/adminController.js
const db = require("../db");
const bcrypt = require('bcryptjs');

const getAdminProfile = (req, res) => {
  if (!req.session.adminId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = "SELECT first_name, last_name FROM admins WHERE id = ?";
  db.query(query, [req.session.adminId], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Admin not found" });

    const { first_name, last_name } = results[0];
    res.json({ first_name, last_name });
  });
};

module.exports = { getAdminProfile };
