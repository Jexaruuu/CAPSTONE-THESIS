const bcrypt = require('bcrypt');
const db = require('../db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const signup = async (req, res) => {
    const { firstName, lastName, mobile, email, password } = req.body;

    if (!firstName || !lastName || !mobile || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const [existingUser] = await db.execute(
            'SELECT * FROM users WHERE email = ? OR mobile = ?', 
            [email, mobile]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ message: "User with this email or mobile already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔐 Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, mobile, email, password, verification_token) VALUES (?, ?, ?, ?, ?, ?)', 
            [firstName, lastName, mobile, email, hashedPassword, verificationToken]
        );

        // 📧 Setup email sender
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "barsanajexter@gmail.com", // ✅ YOUR GMAIL
                pass: "ansrpqxbqeugheok"         // ✅ YOUR GMAIL APP PASSWORD
            }
        });

        const verificationLink = `http://localhost:3000/api/verify-email?token=${verificationToken}`;

        await transporter.sendMail({
            from: '"JD HOMECARE" <barsanajexter@gmail.com>',
            to: email,
            subject: "Verify your JD HOMECARE account",
            html: `
                <p>Hello ${firstName},</p>
                <p>Thank you for signing up. Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}">✅ Verify My Email</a>
            `,
        });

        res.status(201).json({ 
            message: "User created successfully. Please check your email to verify your account.",
            userId: result.insertId 
        });

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Email verification endpoint
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const [user] = await db.execute(
            "SELECT * FROM users WHERE verification_token = ?", 
            [token]
        );

        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        await db.execute("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?", [
            user[0].id,
        ]);

        res.send(`
            <html>
              <head>
                <meta http-equiv="refresh" content="3;url=http://localhost:5173/login" />
                <title>Email Verified</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f9fafb;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    color: #333;
                  }
                  .card {
                    background-color: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    text-align: center;
                  }
                  .success {
                    color: green;
                    font-weight: bold;
                    font-size: 1.2rem;
                  }
                  .redirect {
                    margin-top: 1rem;
                    color: #555;
                  }
                </style>
              </head>
              <body>
                <div class="card">
                  <div class="success">✅ Email verified successfully!</div>
                  <div class="redirect">Redirecting to login page in 3 seconds...</div>
                </div>
              </body>
            </html>
          `);          
    } catch (err) {
        console.error("Error verifying email:", err);
        res.status(500).send("Server error");
    }
};

module.exports = { signup, verifyEmail };
