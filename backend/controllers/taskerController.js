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
  file.mv(filePath);
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

    const taskerData = {
      ...data,
      age,
      profilePicture,
      primaryIDFront,
      primaryIDBack,
      secondaryID,
      clearance,
      proofOfAddress,
      medicalCertificate,
      certificates,
    };

    const result = await createTasker(taskerData);
    res.status(201).json({ message: 'Tasker form submitted successfully' });
  } catch (error) {
    console.error('Error submitting tasker form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔥 Fetch all taskers
const getAllTaskers = async (req, res) => {
  try {
    const [taskers] = await db.query('SELECT * FROM tasker_personal');
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

// 🔥 Reject and delete tasker (and also delete related data)
const rejectTasker = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete related data first to avoid foreign key issues
    await db.query('DELETE FROM tasker_documents WHERE id = ?', [id]);
    await db.query('DELETE FROM tasker_government WHERE id = ?', [id]);
    await db.query('DELETE FROM tasker_professional WHERE id = ?', [id]);
    await db.query('DELETE FROM tasker_personal WHERE id = ?', [id]);

    res.json({ message: 'Tasker and related data rejected and deleted successfully' });
  } catch (error) {
    console.error('Error rejecting and deleting tasker:', error);
    res.status(500).json({ message: 'Server error while rejecting tasker' });
  }
};

// 🔥 View full tasker profile (personal, professional, documents, government)
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

// 🔥 Fetch ONLY approved taskers with full details
const getAllApprovedTaskers = async (req, res) => {
  try {
    const [taskers] = await db.query(`
      SELECT 
        tp.id,
        tp.fullName,
        tp.age,
        tp.gender,
        tp.profilePicture,
        tf.jobType,
        tf.experience,
        tf.skills
      FROM tasker_personal tp
      JOIN tasker_professional tf ON tp.id = tf.id
      WHERE tp.status = 'approved'
    `);

    // Add price per hour
    const taskersWithPrice = taskers.map(tasker => ({
      ...tasker,
      pricePerHour: getPricePerHour(tasker.jobType)
    }));

    res.json(taskersWithPrice);
  } catch (error) {
    console.error('Error fetching approved taskers with full info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ New controller: Get taskers with full info
const getTaskersWithFullInfo = async (req, res) => {
  try {
    const taskers = await fetchTaskersWithFullInfo();
    res.json(taskers);
  } catch (error) {
    console.error('Error fetching taskers with full info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 💰 Reasonable price generator
const getPricePerHour = (jobType) => {
  if (!jobType) return 200; // fallback
  switch (jobType.toLowerCase()) {
    case 'carpenter': return 250;
    case 'electrician': return 300;
    case 'plumber': return 280;
    case 'carwasher': return 150;
    case 'laundry': return 180;
    default: return 200;
  }
};

module.exports = {
  submitTaskerForm,
  getAllTaskers,
  approveTasker,
  rejectTasker,
  getTaskerProfile,
  getAllApprovedTaskers,
  getTaskersWithFullInfo // ✅ Added without touching existing
};
