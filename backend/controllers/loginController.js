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

const validPassword = await bcrypt.compare(password, user[0].password);

if (!validPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
}

        res.status(200).json({ 
            message: "Login successful", 
            user: { 
                id: user[0].id, 
                email: user[0].email, 
                firstName: user[0].first_name, 
                lastName: user[0].last_name 
            } 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { login };
