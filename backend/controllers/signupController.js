const bcrypt = require('bcrypt');
const db = require('../db'); 


const signup = async (req, res) => {
    const { firstName, lastName, mobile, email, password } = req.body;


    if (!firstName || !lastName || !mobile || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }


    try {
        const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ? OR mobile = ?', [email, mobile]);

        if (existingUser.length > 0) {
            return res.status(409).json({ message: "User with this email or mobile already exists" });
        }

   
        const hashedPassword = await bcrypt.hash(password, 10);

    
        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, mobile, email, password) VALUES (?, ?, ?, ?, ?)', 
            [firstName, lastName, mobile, email, hashedPassword]
        );

        res.status(201).json({ message: "User created successfully", userId: result.insertId });

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { signup };
