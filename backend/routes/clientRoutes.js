const express = require('express');
const router = express.Router();
const { 
  bookService, 
  getServiceRequests, 
  deleteClientRequest 
} = require('../controllers/clientController');

// ✅ Existing booking
router.post('/bookservice', bookService);

// ✅ Fetch all service requests
router.get('/requests', getServiceRequests);

// ✅ Delete a service request
router.delete('/:id', deleteClientRequest);

// ✅ ✨ New: Approve a service request
router.put('/approve/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  const db = require('../db');
  try {
    await db.query('UPDATE service_details SET status = "approved" WHERE id = ?', [serviceId]);
    res.json({ message: 'Service request approved successfully' });
  } catch (error) {
    console.error('Error approving service request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ ✨ New: Reject a service request
router.put('/reject/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  const db = require('../db');
  try {
    await db.query('UPDATE service_details SET status = "rejected" WHERE id = ?', [serviceId]);
    res.json({ message: 'Service request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting service request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
