const db = require("../db");
const bcrypt = require('bcryptjs');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔹 Multer config for profile picture upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/profilePictures";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });
exports.uploadProfilePicture = upload.single("profilePicture");

// ✅ Get user by ID
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

// ✅ Update user (with optional password)
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

// ✅ Update basic user info only
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
    } else {
      res.json({ message: "Profile updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update password securely
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

// ✅ Delete user account
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: delete old profile picture file from server here

    await db.query("DELETE FROM users WHERE id = ?", [id]);
    await db.query("ALTER TABLE users AUTO_INCREMENT = 1");

    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ message: "Error clearing session" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Account deleted successfully" });
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// ✅ Update profile picture
exports.updateProfilePicture = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profilePicture = `/uploads/profilePictures/${req.file.filename}`;

    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally remove old profile picture from the server
    const oldPicture = user[0].profile_picture;
    if (oldPicture && fs.existsSync(`.${oldPicture}`)) {
      fs.unlinkSync(`.${oldPicture}`);
    }

    await db.query("UPDATE users SET profile_picture = ? WHERE id = ?", [profilePicture, id]);

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture
    });
  } catch (err) {
    console.error("Profile picture upload error:", err);
    res.status(500).json({ message: "Error updating profile picture", error: err.message });
  }
};

// ✅ Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, first_name, last_name FROM users");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
