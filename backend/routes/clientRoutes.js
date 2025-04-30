const express = require('express');
const router = express.Router();
const { 
  bookService, 
  getServiceRequests, 
  deleteClientRequest,
  getApprovedServices,
  setPendingServiceRequest
} = require('../controllers/clientController');
const db = require('../db'); // ✅ Keep db at top

// ============================
// 📌 Existing Endpoints
// ============================

// ✅ Book a new service request
router.post('/bookservice', bookService);

// ✅ Fetch all service requests (pending + approved + rejected)
router.get('/requests', getServiceRequests);

// ✅ Delete a service request completely
router.delete('/:id', deleteClientRequest);

// ============================
// 📌 Approve / Reject Endpoints
// ============================

// ✅ Approve service request
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

// ✅ Reject service request
// (In frontend we call DELETE now, but keep this PUT if you still want optional future "reject only" without delete)
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

// ============================
// 📌 Fetch Approved Services Only
// ============================

router.get('/approved', getApprovedServices);

router.put('/pending/:serviceId', setPendingServiceRequest);


module.exports = router;
