const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./db'); 
const signupRoutes = require('./routes/signupRoutes'); 
const loginRoutes = require('./routes/loginRoutes'); 
const logoutRoutes = require('./routes/logoutRoutes'); 
const userRoutes = require('./routes/userRoutes');

// ✅ Updated variable name and path to match existing file
const adminsignupRoutes = require('./routes/adminsignupRoutes');
const adminloginRoutes = require('./routes/adminloginRoutes');

const app = express();

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());

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

// ✅ Use the corrected adminRoutes
app.use('/api', adminsignupRoutes); // this registers /api/adminsignup
app.use('/api', adminloginRoutes);

app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
