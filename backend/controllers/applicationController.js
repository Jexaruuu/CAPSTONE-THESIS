// controllers/applicationController.js
const db = require("../db");
const path = require("path");
const fs = require("fs");

// ✅ SUBMIT APPLICATION CONTROLLER
exports.submitApplication = async (req, res) => {
  try {
    console.log("📥 Received application submission.");
    console.log("➡ Body:", req.body);
    console.log("➡ Files:", req.files);

    const {
      fullName,
      email,
      age,
      birthDate,
      sex,
      contactNumber,
      socialMedia,
      jobType,
      toolsEquipment,
      backgroundCheckConsent,
      termsConsent,
      dataPrivacyConsent,
      homeAddress,               // 🆕 New Field
      yearsExperience            // 🆕 New Field
    } = req.body;

    const uploadDir = path.join(__dirname, "../uploads/applications");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = (file, namePrefix) => {
      if (!file) return "";
      const fileName = `${Date.now()}-${namePrefix}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      file.mv(filePath, (err) => {
        if (err) throw err;
      });
      return `/uploads/applications/${fileName}`;
    };

    const profilePicture = saveFile(req.files?.profilePicture, "profile");
    const primaryIdFront = saveFile(req.files?.primaryIdFront, "id-front");
    const primaryIdBack = saveFile(req.files?.primaryIdBack, "id-back");
    const secondaryId = saveFile(req.files?.secondaryId, "id-second");
    const proofOfAddress = saveFile(req.files?.proofOfAddress, "address");
    const medicalCertificate = saveFile(req.files?.medicalCertificate, "med-cert");
    const tesdaCertificate = saveFile(req.files?.tesdaCertificate, "tesda");

    // ✅ Insert into applicant_information (now includes home_address)
    const [infoResult] = await db.query(
      `INSERT INTO applicant_information 
        (fullName, email, birthDate, age, sex, contactNumber, social_media, home_address, profile_picture)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, birthDate, age, sex, contactNumber, socialMedia, homeAddress, profilePicture]
    );

    const applicantId = infoResult.insertId;

    // ✅ Insert into applicant_workinfo (now includes years_experience)
    await db.query(
      `INSERT INTO applicant_workinfo 
        (applicant_id, job_type, tools_equipment, years_experience) 
        VALUES (?, ?, ?, ?)`,
      [applicantId, jobType, toolsEquipment, yearsExperience]
    );

    // ✅ Insert into applicant_documents
    await db.query(
      `INSERT INTO applicant_documents 
        (applicant_id, primary_id_front, primary_id_back, secondary_id, proof_of_address, medical_certificate, tesda_certificate)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        applicantId,
        primaryIdFront,
        primaryIdBack,
        secondaryId,
        proofOfAddress,
        medicalCertificate,
        tesdaCertificate,
      ]
    );

    // ✅ Insert into applicant_agreement
    await db.query(
      `INSERT INTO applicant_agreement 
        (applicant_id, background_check_consent, terms_consent, data_privacy_consent)
        VALUES (?, ?, ?, ?)`,
      [applicantId, backgroundCheckConsent, termsConsent, dataPrivacyConsent]
    );

    res.status(200).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error("❌ Application submission error:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

// ✅ GET ALL APPLICANTS CONTROLLER
exports.getAllApplicants = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM applicant_information`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching applicants:", err);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};
