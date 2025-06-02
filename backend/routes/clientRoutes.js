const express = require('express');
const router = express.Router();
const {
  bookService,
  getServiceRequests,
  deleteClientRequest,
  getApprovedServices,
  setPendingServiceRequest,
  getServiceRequestsByUser
} = require('../controllers/clientController');
const db = require('../db');

// ============================
// 📌 Existing Endpoints
// ============================

router.post('/bookservice', bookService);
router.get('/requests', getServiceRequests);
router.delete('/:id', deleteClientRequest);

// ✅ Soft cancel by setting status to "cancelled"
router.put('/requests/cancel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE service_details SET status = "cancelled" WHERE id = ?', [id]);
    res.status(200).json({ message: 'Service request marked as cancelled.' });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ message: 'Failed to cancel request.' });
  }
});

router.put('/approve/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  try {
    await db.query('UPDATE service_details SET status = "approved" WHERE id = ?', [serviceId]);
    res.json({ message: 'Service request approved successfully' });
  } catch (error) {
    console.error('Error approving service request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/reject/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  try {
    await db.query('UPDATE service_details SET status = "rejected" WHERE id = ?', [serviceId]);
    res.json({ message: 'Service request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting service request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/pending/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  try {
    await db.query('UPDATE service_details SET status = "pending" WHERE id = ?', [serviceId]);
    res.json({ message: 'Service request set to pending' });
  } catch (error) {
    console.error('Error setting pending:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/approved', getApprovedServices);
router.put('/pending/:serviceId', setPendingServiceRequest);
router.get('/requests/:email', getServiceRequestsByUser);

module.exports = router;
