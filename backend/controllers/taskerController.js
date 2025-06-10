const { createTasker, fetchTaskersWithFullInfo } = require('../models/taskerModel');
const db = require('../db');
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

  try {
    file.mv(filePath); // No callback = async error won't be caught
  } catch (err) {
    console.error("Error saving file:", err);
    return null;
  }

  return `/uploads/${folder}/${filename}`;
};

// ✅ Main form submission controller
const submitTaskerForm = async (req, res) => {
  try {
    const data = req.body;
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    const profilePicture = req.files?.profilePicture ? saveFile(req.files.profilePicture, 'profilePictures') : null;
    const primaryIDFront = req.files?.primaryIDFront ? saveFile(req.files.primaryIDFront, 'ids') : null;
    const primaryIDBack = req.files?.primaryIDBack ? saveFile(req.files.primaryIDBack, 'ids') : null;
    const secondaryID = req.files?.secondaryID ? saveFile(req.files.secondaryID, 'ids') : null;
    const clearance = req.files?.clearance ? saveFile(req.files.clearance, 'clearances') : null;
    const proofOfAddress = req.files?.proofOfAddress ? saveFile(req.files.proofOfAddress, 'proofs') : null;
    const medicalCertificate = req.files?.medicalCertificate ? saveFile(req.files.medicalCertificate, 'medical') : null;
    const certificates = req.files?.certificates ? saveFile(req.files.certificates, 'certificates') : null;

    let jobTypeArray;
    try {
      jobTypeArray = typeof data.jobType === 'string' ? JSON.parse(data.jobType) : data.jobType;
      if (!Array.isArray(jobTypeArray)) jobTypeArray = [jobTypeArray];
    } catch (err) {
      console.warn("Failed to parse jobType");
      jobTypeArray = [data.jobType];
    }

    let serviceCategoryObject;
    try {
      serviceCategoryObject = typeof data.serviceCategory === 'string' ? JSON.parse(data.serviceCategory) : data.serviceCategory;
    } catch (err) {
      console.warn("Failed to parse serviceCategory");
      serviceCategoryObject = data.serviceCategory || {};
    }

    const taskerData = {
      ...data,
      jobType: JSON.stringify(jobTypeArray),
      serviceCategory: JSON.stringify(serviceCategoryObject),
      age,
      profilePicture,
      primaryIDFront,
      primaryIDBack,
      secondaryID,
      clearance,
      proofOfAddress,
      medicalCertificate,
      certificates,
      social_media: data.social_media,
      tools_equipment: data.tools_equipment || null
    };

    Object.keys(taskerData).forEach(key => {
      if (taskerData[key] === undefined) taskerData[key] = null;
    });

    await createTasker(taskerData);
    res.status(201).json({ message: 'Tasker form submitted successfully' });
  } catch (error) {
    console.error('Error submitting tasker form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔥 Fetch all taskers
const getAllTaskers = async (req, res) => {
  try {
    const [taskers] = await db.query(`
      SELECT 
        tp.id,
        tp.fullName,
        tp.age,
        tp.gender,
        tp.contactNumber,
        tp.email,
        tp.address,
        tp.profilePicture,
        tf.jobType,
        tf.serviceCategory,
        tf.experience,
        tf.skills,
        tf.rate_per_hour,
        tf.has_tools,
        td.proofOfAddress,
        td.medicalCertificate,
        td.certificates AS additionalCertificate
      FROM tasker_personal tp
      JOIN tasker_professional tf ON tp.id = tf.id
      LEFT JOIN tasker_documents td ON tp.id = td.id
      WHERE tp.status = 'approved'
    `);

    res.json(taskers);
  } catch (error) {
    console.error('Error fetching taskers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔥 Approve tasker
const approveTasker = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE tasker_personal SET status = "approved" WHERE id = ?', [id]);
    res.json({ message: 'Tasker approved successfully' });
  } catch (error) {
    console.error('Error approving tasker:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Reject tasker
const rejectTasker = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE tasker_personal SET status = "rejected" WHERE id = ?', [id]);
    res.json({ message: 'Tasker rejected successfully' });
  } catch (error) {
    console.error('Error rejecting tasker:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔥 View full tasker profile
const getTaskerProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const [personal] = await db.query('SELECT * FROM tasker_personal WHERE id = ?', [id]);
    const [professional] = await db.query('SELECT * FROM tasker_professional WHERE id = ?', [id]);
    const [documents] = await db.query('SELECT * FROM tasker_documents WHERE id = ?', [id]);
    const [government] = await db.query('SELECT * FROM tasker_government WHERE id = ?', [id]);

    if (personal.length === 0) {
      return res.status(404).json({ message: 'Tasker not found' });
    }

    res.json({
      personal: personal[0],
      professional: professional[0],
      documents: documents[0],
      government: government[0]
    });
  } catch (error) {
    console.error('Error fetching full tasker profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔥 Fetch only approved taskers
// 🔥 Fetch only approved taskers (excluding current user if query param exists)
const getAllApprovedTaskers = async (req, res) => {
  const currentUserEmail = req.query.excludeEmail;

  try {
    let query = `
      SELECT 
        tp.id,
        tp.fullName,
        tp.age,
        tp.gender,
        tp.contactNumber,
        tp.email,
        tp.address,
        tp.profilePicture,
        tf.jobType,
        tf.serviceCategory,
        tf.experience,
        tf.skills,
        tf.rate_per_hour,
        tf.tools_equipment,
        td.proofOfAddress,
        td.medicalCertificate,
        td.certificates AS additionalCertificate,
        td.clearance
      FROM tasker_personal tp
      JOIN tasker_professional tf ON tp.id = tf.id
      LEFT JOIN tasker_documents td ON tp.id = td.id
      WHERE tp.status = 'approved'
    `;

    const values = [];

    if (currentUserEmail) {
      query += ` AND tp.email != ?`;
      values.push(currentUserEmail.trim().toLowerCase());
    }

     const [taskers] = await db.query(query, values);

    const taskersWithPrice = taskers.map(tasker => ({
      ...tasker,
      pricePerHour: tasker.rate_per_hour || null
    }));

    res.json(taskersWithPrice);
  } catch (error) {
    console.error('Error fetching approved taskers with full info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTaskersWithFullInfo = async (req, res) => {
  try {
    const taskers = await fetchTaskersWithFullInfo();
    res.json(taskers);
  } catch (error) {
    console.error('Error fetching taskers with full info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const setTaskerRate = async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;

  if (!rate || isNaN(rate)) {
    return res.status(400).json({ message: 'Invalid rate value' });
  }

  try {
    const [result] = await db.query(
      'UPDATE tasker_professional SET rate_per_hour = ? WHERE id = ?',
      [rate, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tasker not found' });
    }

    res.json({ message: 'Rate updated successfully' });
  } catch (error) {
    console.error('Error setting tasker rate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const setTaskerPending = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE tasker_personal SET status = "pending" WHERE id = ?', [id]);
    res.json({ message: 'Tasker marked as pending' });
  } catch (error) {
    console.error('Error setting tasker to pending:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ File serving
const getProfilePicture = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT profilePicture FROM tasker_personal WHERE id = ?', [id]);
    if (rows.length === 0 || !rows[0].profilePicture) return res.sendStatus(404);
    const filePath = path.join(__dirname, '../', rows[0].profilePicture);
    if (!fs.existsSync(filePath)) return res.sendStatus(404);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProofOfAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT proofOfAddress FROM tasker_documents WHERE id = ?', [id]);
    if (rows.length === 0 || !rows[0].proofOfAddress) return res.sendStatus(404);
    const filePath = path.join(__dirname, '../', rows[0].proofOfAddress);
    if (!fs.existsSync(filePath)) return res.sendStatus(404);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving proof of address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMedicalCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT medicalCertificate FROM tasker_documents WHERE id = ?', [id]);
    if (rows.length === 0 || !rows[0].medicalCertificate) return res.sendStatus(404);
    const filePath = path.join(__dirname, '../', rows[0].medicalCertificate);
    if (!fs.existsSync(filePath)) return res.sendStatus(404);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving medical certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOptionalCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT certificates FROM tasker_documents WHERE id = ?', [id]);
    if (rows.length === 0 || !rows[0].certificates) return res.sendStatus(404);
    const filePath = path.join(__dirname, '../', rows[0].certificates);
    if (!fs.existsSync(filePath)) return res.sendStatus(404);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving optional certificate:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getClearance = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT clearance FROM tasker_documents WHERE id = ?', [id]);
    if (rows.length === 0 || !rows[0].clearance) return res.sendStatus(404);
    const filePath = path.join(__dirname, '../', rows[0].clearance);
    if (!fs.existsSync(filePath)) return res.sendStatus(404);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving clearance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelTaskerApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      `UPDATE tasker_personal SET status = 'Cancelled' WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tasker application not found" });
    }

    res.json({ message: "Tasker application cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling tasker application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get taskers by email (updated)
const getTaskersByEmail = async (req, res) => {
  const { email } = req.params;

  try {
const [rows] = await db.query(`
  SELECT 
    tp.id,
    tp.fullName,
    tp.profilePicture,
    tp.email,
    tp.age,
    tp.contactNumber,
    tp.address,
    tp.status,
    tf.jobType,
    tf.serviceCategory,
    tf.experience,
    tf.skills,
    tf.tools_equipment,
    tf.rate_per_hour,
    td.proofOfAddress,
    td.medicalCertificate,
    td.certificates AS additionalCertificate,
    td.clearance
  FROM tasker_personal tp
  JOIN tasker_professional tf ON tp.id = tf.id
  LEFT JOIN tasker_documents td ON tp.id = td.id
  WHERE tp.email = ?
`, [email]);


   if (rows.length === 0) {
  return res.json([]); // No applications yet, return empty array
}

    const parsed = rows.map(tasker => {
      let jobTypeParsed = [];
      let serviceCategoriesParsed = [];

      try {
        jobTypeParsed = JSON.parse(tasker.jobType || "[]");
      } catch {
        jobTypeParsed = [];
      }

      try {
        serviceCategoriesParsed = Array.isArray(tasker.serviceCategory)
          ? tasker.serviceCategory
          : JSON.parse(tasker.serviceCategory || "[]");
      } catch {
        serviceCategoriesParsed = [];
      }

return {
  id: tasker.id,
  fullName: tasker.fullName,
  email: tasker.email,
  age: tasker.age,
  contactNumber: tasker.contactNumber,
  address: tasker.address,
  status: tasker.status,
  profilePicture: tasker.profilePicture,
  job_type: jobTypeParsed,
  service_categories: serviceCategoriesParsed,
  experience: tasker.experience,
  skills: tasker.skills,
  tools_equipment: tasker.tools_equipment,
  price_rate: tasker.rate_per_hour,
  proofOfAddress: tasker.proofOfAddress,
  medicalCertificate: tasker.medicalCertificate,
  additionalCertificate: tasker.additionalCertificate,
  clearance: tasker.clearance
};
    });

    res.json(parsed);
  } catch (error) {
    console.error("Error fetching taskers by email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitTaskerForm,
  getAllTaskers,
  approveTasker,
  rejectTasker,
  getTaskerProfile,
  getAllApprovedTaskers,
  getTaskersWithFullInfo,
  setTaskerRate,
  setTaskerPending,
  getProfilePicture,
  getProofOfAddress,
  getMedicalCertificate,
  getOptionalCertificate,
  getClearance,
  getTaskersByEmail,
  cancelTaskerApplication
};