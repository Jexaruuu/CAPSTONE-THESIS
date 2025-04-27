const bcrypt = require('bcrypt');
const db = require('../db');

const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const [admin] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);

        if (!admin || admin.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const validPassword = await bcrypt.compare(password, admin[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        req.session.admin = {
            id: admin[0].id,
            username: admin[0].username
        };
        

        res.status(200).json({
            success: true, // ✅ Added this line
            message: "Admin login successful",
            admin: {
                id: admin[0].id,
                username: admin[0].username,
                firstName: admin[0].first_name,
                lastName: admin[0].last_name,
                email: admin[0].email
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { adminLogin };
