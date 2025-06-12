const db = require('../db');
const path = require('path');
const fs = require('fs');

// ✅ Book a new service request
const bookService = async (req, res) => {
  try {
    const {
      firstName, lastName, contactNumber, email,
      street, barangay, additionalAddress,
      serviceType, serviceDescription,
      preferredDate, preferredTime, urgentRequest,
      socialMedia = "N/A"
    } = req.body;

    if (!firstName || !lastName || !contactNumber) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let profilePicturePath = null;
    let serviceImagePath = null;

    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (req.files?.profilePicture) {
      const profilePicture = req.files.profilePicture;
      const filename = `${Date.now()}_${profilePicture.name}`;
      const uploadPath = path.join(uploadsDir, filename);
      await profilePicture.mv(uploadPath);
      profilePicturePath = `/uploads/${filename}`;
    } else {
      return res.status(400).json({ message: "Profile picture is required." });
    }

    if (req.files?.serviceImage) {
      const serviceImage = req.files.serviceImage;
      const filename = `${Date.now()}_${serviceImage.name}`;
      const uploadPath = path.join(uploadsDir, filename);
      await serviceImage.mv(uploadPath);
      serviceImagePath = `/uploads/${filename}`;
    }

    const [client] = await db.execute(
      `INSERT INTO client_information 
       (first_name, last_name, contact_number, email, street, barangay, additional_address, profile_picture, social_media) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, contactNumber, email, street, barangay, additionalAddress, profilePicturePath, socialMedia]
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
    console.error("Booking error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// ✅ Fetch all service requests (pending, approved, rejected)
const getServiceRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id AS client_id, c.first_name, c.last_name, c.contact_number, c.email, 
             c.barangay, c.street, c.additional_address, c.profile_picture, c.social_media,
             s.id AS service_id, s.service_type, s.service_description, 
             s.preferred_date, s.preferred_time, s.urgent_request, s.service_image, s.status
      FROM client_information c
      JOIN service_details s ON c.id = s.client_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete service request completely
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

// ✅ Fetch approved services (for client view)
const getApprovedServices = async (req, res) => {
  try {
    const currentUserEmail = req.query.email;

    let query = `
      SELECT 
        c.first_name, c.last_name, c.contact_number, c.email,
        c.street, c.barangay, c.additional_address, c.profile_picture, c.social_media,
        s.id AS service_id, s.service_type, s.service_description,
        s.preferred_date, s.preferred_time, 
        IF(s.urgent_request = 1, 'Yes', 'No') AS urgent_request,
        s.service_image, s.status
      FROM client_information c
      JOIN service_details s ON c.id = s.client_id
      WHERE s.status = 'approved'
    `;

    const params = [];
    if (currentUserEmail) {
      query += ` AND c.email != ?`;
      params.push(currentUserEmail);
    }

    const [rows] = await db.query(query, params);

    const services = rows.map(service => ({
      ...service,
      address: `${service.street}, ${service.barangay}, ${service.additional_address}`.trim()
    }));

    res.json(services);
  } catch (error) {
    console.error('Error fetching approved services:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Set service request to pending
const setPendingServiceRequest = async (req, res) => {
  const { serviceId } = req.params;
  try {
    await db.query('UPDATE service_details SET status = "pending" WHERE id = ?', [serviceId]);
    res.json({ message: 'Service request marked as pending' });
  } catch (error) {
    console.error('Error setting pending status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Fetch service requests for a specific user by email
const getServiceRequestsByUser = async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        c.id AS client_id, c.first_name, c.last_name, c.contact_number, c.email, 
        c.barangay, c.street, c.additional_address, c.profile_picture, c.social_media,
        s.id AS service_id, s.service_type, s.service_description, 
        s.preferred_date, s.preferred_time, s.urgent_request, 
        s.service_image, s.status
      FROM client_information c
      JOIN service_details s ON c.id = s.client_id
      WHERE c.email = ?
      ORDER BY s.preferred_date DESC
    `, [email]);

    const formatted = rows.map(req => ({
      id: req.service_id,
      service_category: req.service_type,
      address: `${req.street}, ${req.barangay}, ${req.additional_address}`.trim(),
      preferred_time: req.preferred_time,
      urgency: req.urgent_request ? "Yes" : "No",
      status: req.status,
      service_image: req.service_image,
      social_media: req.social_media
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching user service requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  bookService,
  getServiceRequests,
  deleteClientRequest,
  getApprovedServices,
  setPendingServiceRequest,
  getServiceRequestsByUser
};
