const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./db'); 
const signupRoutes = require('./routes/signupRoutes'); 
const loginRoutes = require('./routes/loginRoutes'); 
const logoutRoutes = require('./routes/logoutRoutes'); 
const userRoutes = require('./routes/userRoutes');

const app = express(); // Initialize the app here

// CORS configuration - Allow specific origin with credentials
app.use(cors({
    origin: "http://localhost:5173", // Specify the frontend URL
    methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
    credentials: true // Allow credentials (cookies/session) to be sent
}));

app.use(express.json());

// Session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,  // Set to `true` when using HTTPS
        httpOnly: true, // Prevent JavaScript access to cookies
        sameSite: "None", // Enable cross-origin requests with credentials
    }
}));

// Routes
app.use('/api', signupRoutes);
app.use('/api', loginRoutes);
app.use('/api', logoutRoutes); 
app.use('/api', userRoutes);

// Test endpoint
app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
