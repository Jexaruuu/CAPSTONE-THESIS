const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

const db = require('./db');
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true               
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false, 
    cookie: {
        secure: false,           
        httpOnly: true,
        sameSite: "Lax",        
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.get('/api/debug-session', (req, res) => {
    console.log("Session debug:", req.session);
    res.json({
        sessionExists: !!req.session,
        userExists: !!req.session.user,
        userId: req.session.user ? req.session.user.user_id : null
    });
});

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
app.use("/api/applicants", require("./routes/applicationRoutes"));

app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
