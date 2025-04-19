// controllers/adminsignupController.js
const bcrypt = require('bcrypt');
const db = require('../db');

const adminSignup = async (req, res) => {
    const { firstName, lastName, email, username, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    try {
        // Check if the admin already exists by email or username
        const [existingAdmin] = await db.execute('SELECT * FROM admins WHERE username = ? OR email = ?', [username, email]);

        if (existingAdmin.length > 0) {
            return res.status(409).json({ success: false, message: 'Admin with this username or email already exists' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new admin into the database
        const [result] = await db.execute(
            'INSERT INTO admins (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, username, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            adminId: result.insertId
        });
    } catch (error) {
        console.error('Admin signup error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { adminSignup };
