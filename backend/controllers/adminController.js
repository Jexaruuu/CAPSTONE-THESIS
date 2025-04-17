const bcrypt = require('bcrypt');
const db = require('../db'); // Your MySQL pool
const saltRounds = 10;

exports.signup = async (req, res) => {
    const { username, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const sql = 'INSERT INTO admins (username, password) VALUES (?, ?)';
      db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: 'Signup failed', error: err });
        res.status(201).json({ success: true, message: 'Admin created' });
      });
    } catch (err) {
      res.status(500).json({ message: 'Error signing up admin' });
    }
  };

  exports.login = (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM admins WHERE username = ?';
  
    db.query(sql, [username], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Login error', error: err });
      if (results.length === 0) return res.status(404).json({ message: 'Admin not found' });
  
      const isMatch = await bcrypt.compare(password, results[0].password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      req.session.adminId = results[0].id;
      res.status(200).json({ success: true, message: 'Login successful' });
    });
  };

  exports.isAdminLoggedIn = (req, res, next) => {
    if (req.session.adminId) {
      return next();
    } else {
      return res.status(401).json({ message: 'Admin not authenticated' });
    }
  };

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
};

// Optional CRUD endpoints
exports.getAdminById = (req, res) => {
  const sql = 'SELECT id, username FROM admins WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Fetch error' });
    res.json(results[0]);
  });
};

exports.updateAdmin = (req, res) => {
  const { username, password } = req.body;
  const sql = 'UPDATE admins SET username = ?, password = ? WHERE id = ?';

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Hashing error' });
    db.query(sql, [username, hashedPassword, req.params.id], (err) => {
      if (err) return res.status(500).json({ message: 'Update failed' });
      res.json({ message: 'Admin updated' });
    });
  });
};

exports.deleteAdmin = (req, res) => {
  const sql = 'DELETE FROM admins WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Delete failed' });
    res.json({ message: 'Admin deleted' });
  });
};
