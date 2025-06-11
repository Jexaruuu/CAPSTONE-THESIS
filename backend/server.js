const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload'); // ✅ Added

const db = require('./db');

const app = express();

// ✅ Middleware for file uploads
app.use(fileUpload({ createParentPath: true })); // ✅ Added

// ✅ CORS Configuration
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Session Configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "None",
    }
}));

// ✅ API Routes
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

// ✅ ✅ Applicant routes (ADDED but not replacing any existing route)
app.use('/api/applicants', require('./routes/applicationRoutes'));

// ✅ Default Route
app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
