const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const db = require('./db');

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.use('/api/applicants', require('./routes/applicationRoutes'));

app.use('/api/payment', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
