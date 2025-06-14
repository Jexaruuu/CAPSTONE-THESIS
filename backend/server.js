const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

const db = require('./db');
const app = express();

// ✅ Step 1: CORS config — make sure credentials are allowed before anything else
app.use(cors({
    origin: "http://localhost:5173", // frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true               // allow cookies/session to be sent
}));

// ✅ Step 2: Required middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Step 3: Session config
app.use(session({
    secret: 'your_secret_key',      // use env var in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,              // true only if using HTTPS
        httpOnly: true,
        sameSite: "Lax",            // "Lax" is safest cross-port (5173 + 3000)
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// ✅ Optional debug route — helpful for testing session status
app.get('/api/debug-session', (req, res) => {
    console.log("🔍 Session debug:", req.session);
    res.json({
        sessionExists: !!req.session,
        userExists: !!req.session.user,
        userId: req.session.user ? req.session.user.user_id : null,
        fullUser: req.session.user || null
    });
});

// ✅ Route registrations (leave unchanged)
app.use('/api', require('./routes/signupRoutes'));
app.use('/api', require('./routes/loginRoutes'));
app.use('/api', require('./routes/logoutRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/adminsignupRoutes'));
app.use('/api', require('./routes/adminloginRoutes'));
app.use('/api', require('./routes/adminlogoutRoutes'));
app.use('/api', require('./routes/adminRoutes'));
app.use('/api/taskers', require('./routes/taskerRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/applicants', require("./routes/applicationRoutes"));

// ✅ Basic root route
app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
