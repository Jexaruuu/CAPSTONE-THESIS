const bcrypt = require('bcrypt');
const db = require('../db');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (!user || user.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const userData = user[0];

        // ✅ Check if email is verified
        if (!userData.is_verified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const validPassword = await bcrypt.compare(password, userData.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // ✅ Save the logged-in user info inside session
        req.session.user = {
            id: userData.id,
            email: userData.email,
            firstName: userData.first_name,
            lastName: userData.last_name
        };

        res.status(200).json({
            message: "Login successful",
            user: {
                id: userData.id,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { login };
