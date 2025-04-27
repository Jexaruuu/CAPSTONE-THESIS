const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./db'); 
const signupRoutes = require('./routes/signupRoutes'); 
const loginRoutes = require('./routes/loginRoutes'); 
const logoutRoutes = require('./routes/logoutRoutes'); 
const userRoutes = require('./routes/userRoutes');

// ✅ Keep only 1 fileUpload import here
const fileUpload = require('express-fileupload');

// ✅ Correct app initialization before using any middleware
const app = express();

const adminsignupRoutes = require('./routes/adminsignupRoutes');
const adminloginRoutes = require('./routes/adminloginRoutes');
const adminlogoutRoutes = require("./routes/adminlogoutRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ✅ New imports for Tasker form
const taskerRoutes = require('./routes/taskerRoutes');

// ✅ Now your middlewares

// CORS configuration
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ For handling file uploads (Tasker form)
app.use(fileUpload()); // correct position after express.json()
app.use('/uploads', express.static('uploads')); // serve uploads folder statically

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

// ✅ Your existing routes
app.use('/api', signupRoutes);
app.use('/api', loginRoutes);
app.use('/api', logoutRoutes); 
app.use('/api', userRoutes);

app.use('/api', adminsignupRoutes); 
app.use('/api', adminloginRoutes);
app.use("/api", adminlogoutRoutes);
app.use("/api", adminRoutes);

// ✅ New route for tasker form
app.use('/api/taskers', taskerRoutes);

// ✅ Default route
app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

// ✅ Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
