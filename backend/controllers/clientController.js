const db = require('../db');
const path = require('path');
const fs = require('fs');

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

    // Check if uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    if (req.files) {
      // Handle profile picture upload
      if (req.files.profilePicture) {
        const profilePicture = req.files.profilePicture;
        const filename = `${Date.now()}_${profilePicture.name}`;
        const uploadPath = path.join(uploadsDir, filename);

        await profilePicture.mv(uploadPath);
        profilePicturePath = `/uploads/${filename}`;
      } else {
        return res.status(400).json({ message: "Profile picture is required." });
      }

      // Handle service image upload (optional)
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

    // Insert into client_information
    const [client] = await db.execute(
      `INSERT INTO client_information 
      (first_name, last_name, contact_number, email, street, barangay, additional_address, profile_picture) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, contactNumber, email, street, barangay, additionalAddress, profilePicturePath]
    );

    const clientId = client.insertId;

    // Insert into service_details
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
    console.error(error); // <-- backend will log real error if something fails
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = { bookService };
