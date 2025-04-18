const bcrypt = require('bcrypt');
const db = require('../db');

const adminSignup = async (req, res) => {
  const { firstName, lastName, email, username, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const [existingAdmin] = await db.execute('SELECT * FROM admins WHERE username = ? OR email = ?', [username, email]);

    if (existingAdmin.length > 0) {
      return res.status(409).json({ message: 'Admin with this username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO admins (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, username, hashedPassword]
    );

    return res.status(201).json({ success: true, message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { adminSignup };
