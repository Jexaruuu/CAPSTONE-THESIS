// controllers/adminController.js
const db = require('../db');  // Assuming you're using MySQL or another database

// Get admin profile by ID
const getAdminProfile = async (req, res) => {
  const adminId = req.params.id;

  try {
    const [admin] = await db.execute('SELECT * FROM admins WHERE id = ?', [adminId]);

    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin[0]);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update admin profile information
const updateAdminInfo = async (req, res) => {
  const adminId = req.params.id;
  const { firstName, lastName, email } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE admins SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
      [firstName, lastName, email, adminId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Admin not found or no changes made' });
    }

    res.status(200).json({ message: 'Admin profile updated successfully' });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update admin password
const updateAdminPassword = async (req, res) => {
  const adminId = req.params.id;
  const { newPassword } = req.body;
  const bcrypt = require('bcrypt');

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db.execute(
      'UPDATE admins SET password = ? WHERE id = ?',
      [hashedPassword, adminId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Admin not found or no changes made' });
    }

    res.status(200).json({ message: 'Admin password updated successfully' });
  } catch (error) {
    console.error('Error updating admin password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAdminProfile, updateAdminInfo, updateAdminPassword };
