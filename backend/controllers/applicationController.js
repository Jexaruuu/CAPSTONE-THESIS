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

// ✅ GET SERVICE REQUEST APPLICANTS WITH FULL INFO
// ✅ SAFE GET ALL APPLICANTS WITH FULL JOIN
exports.getServiceRequestApplicants = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ai.id, ai.fullName, ai.email, ai.age, ai.birthDate, ai.sex, ai.contactNumber,
        ai.social_media, ai.home_address, ai.profile_picture, ai.status,

        aw.job_type,
        aw.years_experience,
        aw.tools_equipment,

        ad.primary_id_front,
        ad.primary_id_back,
        ad.secondary_id,
        ad.proof_of_address,
        ad.medical_certificate,
        ad.tesda_certificate,

        aa.background_check_consent,
        aa.terms_consent,
        aa.data_privacy_consent

      FROM applicant_information ai
      LEFT JOIN applicant_workinfo aw ON aw.applicant_id = ai.id
      LEFT JOIN applicant_documents ad ON ad.applicant_id = ai.id
      LEFT JOIN applicant_agreement aa ON aa.applicant_id = ai.id
      ORDER BY ai.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ BACKEND SQL ERROR:", err.message);
    console.error("📌 FULL ERROR:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ✅ UPDATE STATUS (APPROVE / REJECT / PENDING)
exports.updateApplicantStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query("UPDATE applicant_information SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Applicant status updated successfully." });
  } catch (error) {
    console.error("❌ Failed to update applicant status:", error);
    res.status(500).json({ message: "Error updating status" });
  }
};

