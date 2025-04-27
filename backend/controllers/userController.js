const db = require("../db"); // Assuming db.js is correctly set up for MySQL
const bcrypt = require('bcryptjs');

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, mobile, email, password } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, mobile = ?, email = ?, password = ? WHERE id = ?",
      [first_name, last_name, mobile, email, password || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error logging out" });
        }
        res.json({ message: "Password updated successfully. Please log out and log in again." });
      });
    } else {
      res.json({ message: "Profile updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE ONLY INFORMATION
exports.updateInfo = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, mobile, email } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, mobile = ?, email = ? WHERE id = ?",
      [first_name, last_name, mobile, email, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    else {
      res.json({ message: "Profile updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = users[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ 
          message: "Error logging out",
          error: err.message 
        });
      }
      res.clearCookie('connect.sid');
      res.json({ message: "Password updated. Please login again." });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!req.session.userId || req.session.userId !== id) {
    return res.status(403).json({ message: "Not authorized to delete this account" });
  }

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    await db.query("ALTER TABLE users AUTO_INCREMENT = 1");

    res.json({ message: "User deleted successfully and ID reset to 1" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// ✅ NEW: Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, first_name, last_name FROM users");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
