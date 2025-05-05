const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const db = require('../db');

const adminSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const [existingAdmin] = await db.execute(
      'SELECT * FROM admins WHERE username = ? OR email = ?', [username, email]
    );

    if (existingAdmin.length > 0) {
      return res.status(409).json({ success: false, message: 'Username or email already exists' });
    }

    let profilePicturePath = null;
    if (req.files && req.files.profilePicture) {
      const file = req.files.profilePicture;
      const filename = `${Date.now()}_${file.name}`;
      const uploadPath = path.join(__dirname, '../uploads/admins');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

      const filePath = path.join(uploadPath, filename);
      await file.mv(filePath);
      profilePicturePath = `/uploads/admins/${filename}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO admins (first_name, last_name, email, username, password, profile_picture) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, username, hashedPassword, profilePicturePath]
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      adminId: result.insertId
    });

  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { adminSignup };
