// controllers/adminController.js
const db = require('../db');  // Assuming you're using MySQL or another database

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

const countUserAndAdmin = async (req, res) => {
  try {
    const [userResult] = await db.execute('SELECT COUNT(*) as userCount FROM users');
    const [adminResult] = await db.execute('SELECT COUNT(*) as adminCount FROM admins');
    res.status(200).json({
      users: userResult[0].userCount,
      admins: adminResult[0].adminCount,
    });
  } catch (error) {
    console.error('Error counting users and admins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const [admins] = await db.execute('SELECT id, first_name, last_name FROM admins');
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAdmin = async (req, res) => {
  const adminId = req.params.id;
  try {
    const [result] = await db.execute('DELETE FROM admins WHERE id = ?', [adminId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ NEW: Fetch full admin details by ID (for View Profile modal)
const getAdminById = async (req, res) => {
  const adminId = req.params.id;
  try {
    const [admin] = await db.execute('SELECT * FROM admins WHERE id = ?', [adminId]);
    if (admin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin[0]);
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminInfo,
  updateAdminPassword,
  countUserAndAdmin,
  getAllAdmins,
  deleteAdmin,
  getAdminById // ✅ added properly
};
