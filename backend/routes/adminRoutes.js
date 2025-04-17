const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Auth
router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

// Admin CRUD (optional)
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

// Protected dashboard route
router.get('/dashboard', adminController.isAdminLoggedIn, (req, res) => {
  // Protected dashboard route
  res.json({ message: 'Welcome to Admin Dashboard' });
});

module.exports = router;
