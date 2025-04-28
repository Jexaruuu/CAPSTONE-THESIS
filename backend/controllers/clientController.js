const db = require('../db');
const path = require('path');
const fs = require('fs');

// ✅ Existing: Book Service
const bookService = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.contactNumber) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const {
      firstName, lastName, contactNumber, email,
      street, barangay, additionalAddress,
      serviceType, serviceDescription,
      preferredDate, preferredTime, urgentRequest
    } = req.body;

    let profilePicturePath = null;
    let serviceImagePath = null;

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (req.files) {
      if (req.files.profilePicture) {
        const profilePicture = req.files.profilePicture;
        const filename = `${Date.now()}_${profilePicture.name}`;
        const uploadPath = path.join(uploadsDir, filename);
        await profilePicture.mv(uploadPath);
        profilePicturePath = `/uploads/${filename}`;
      } else {
        return res.status(400).json({ message: "Profile picture is required." });
      }

      if (req.files.serviceImage) {
        const serviceImage = req.files.serviceImage;
        const serviceFilename = `${Date.now()}_${serviceImage.name}`;
        const serviceUploadPath = path.join(uploadsDir, serviceFilename);
        await serviceImage.mv(serviceUploadPath);
        serviceImagePath = `/uploads/${serviceFilename}`;
      }
    } else {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const [client] = await db.execute(
      `INSERT INTO client_information 
      (first_name, last_name, contact_number, email, street, barangay, additional_address, profile_picture) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, contactNumber, email, street, barangay, additionalAddress, profilePicturePath]
    );

    const clientId = client.insertId;

    await db.execute(
      `INSERT INTO service_details 
      (client_id, service_type, service_description, preferred_date, preferred_time, urgent_request, service_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        clientId,
        serviceType,
        serviceDescription,
        preferredDate,
        preferredTime,
        urgentRequest === 'on' ? 1 : 0,
        serviceImagePath
      ]
    );

    res.status(200).json({ message: "Service booked successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// ✅ NEW: Fetch All Service Requests
const getServiceRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id AS client_id, c.first_name, c.last_name, c.contact_number, c.email, 
             c.barangay, c.street, c.additional_address, c.profile_picture,
             s.id AS service_id, s.service_type, s.service_description, 
             s.preferred_date, s.preferred_time, s.urgent_request, s.service_image
      FROM client_information c
      JOIN service_details s ON c.id = s.client_id
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ NEW: Delete Service Request
const deleteClientRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM service_details WHERE client_id = ?', [id]);
    await db.query('DELETE FROM client_information WHERE id = ?', [id]);
    res.json({ message: 'Service request deleted successfully' });
  } catch (error) {
    console.error('Error deleting service request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { bookService, getServiceRequests, deleteClientRequest };
