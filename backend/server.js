const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./db'); 
const signupRoutes = require('./routes/signupRoutes'); 
const loginRoutes = require('./routes/loginRoutes'); 
const logoutRoutes = require('./routes/logoutRoutes'); 
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const fileUpload = require('express-fileupload');

const app = express(); // Correct initialization before using any middleware

const adminsignupRoutes = require('./routes/adminsignupRoutes');
const adminloginRoutes = require('./routes/adminloginRoutes');
const adminlogoutRoutes = require("./routes/adminlogoutRoutes");
const adminRoutes = require("./routes/adminRoutes");
const taskerRoutes = require('./routes/taskerRoutes');

// ✅ Correct middleware order:

// CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

// File Upload Middleware FIRST!
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));


// Then Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use('/uploads', express.static('uploads'));

// Session configuration
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

// Routes
app.use('/api', signupRoutes);
app.use('/api', loginRoutes);
app.use('/api', logoutRoutes); 
app.use('/api', userRoutes);
app.use('/api', adminsignupRoutes); 
app.use('/api', adminloginRoutes);
app.use('/api', adminlogoutRoutes);
app.use('/api', adminRoutes);
app.use('/api/taskers', taskerRoutes);
app.use('/api/clients', clientRoutes); // ✅ no problem here

// Default Route
app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
