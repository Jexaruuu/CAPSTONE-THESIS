const { createTasker } = require('../models/taskerModel');
const path = require('path');
const fs = require('fs');

// ✅ Safe saveFile function
const saveFile = (file, folder) => {
  if (!file) return null;
  const uploadPath = path.join(__dirname, '../uploads', folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  const filename = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadPath, filename);
  file.mv(filePath);
  return `/uploads/${folder}/${filename}`;
};

// ✅ Main form submission controller
const submitTaskerForm = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Calculate age automatically based on birthDate
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    // ✅ Handle file uploads
    const profilePicture = req.files?.profilePicture ? saveFile(req.files.profilePicture, 'profilePictures') : null;
    const primaryIDFront = req.files?.primaryIDFront ? saveFile(req.files.primaryIDFront, 'ids') : null;
    const primaryIDBack = req.files?.primaryIDBack ? saveFile(req.files.primaryIDBack, 'ids') : null;
    const secondaryID = req.files?.secondaryID ? saveFile(req.files.secondaryID, 'ids') : null;
    const clearance = req.files?.clearance ? saveFile(req.files.clearance, 'clearances') : null;
    const proofOfAddress = req.files?.proofOfAddress ? saveFile(req.files.proofOfAddress, 'proofs') : null;
    const medicalCertificate = req.files?.medicalCertificate ? saveFile(req.files.medicalCertificate, 'medical') : null;
    const certificates = req.files?.certificates ? saveFile(req.files.certificates, 'certificates') : null;

    const taskerData = {
      ...data,
      age,  // ✅ Inject computed age
      profilePicture,
      primaryIDFront,
      primaryIDBack,
      secondaryID,
      clearance,
      proofOfAddress,
      medicalCertificate,
      certificates,
    };

    // ✅ Insert to database
    const result = await createTasker(taskerData);

    res.status(201).json({ message: 'Tasker form submitted successfully' });

  } catch (error) {
    console.error('Error submitting tasker form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Export the controller
module.exports = { submitTaskerForm };
