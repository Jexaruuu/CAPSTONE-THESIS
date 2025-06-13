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
      homeAddress,
      yearsExperience,
      serviceRequestId // 👈 Include the service_request_id reference
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

    const userId = req.session.user?.user_id;

    // ✅ Insert into applicant_information
    const [infoResult] = await db.query(
      `INSERT INTO applicant_information 
        (fullName, email, birthDate, age, sex, contactNumber, social_media, home_address, profile_picture, service_request_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fullName, email, birthDate, age, sex, contactNumber, socialMedia, homeAddress, profilePicture, serviceRequestId, userId]
    );

    const applicantId = infoResult.insertId;

    await db.query(
      `INSERT INTO applicant_workinfo 
        (applicant_id, job_type, tools_equipment, years_experience) 
        VALUES (?, ?, ?, ?)`,
      [applicantId, jobType, toolsEquipment, yearsExperience]
    );

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

// ✅ GET ALL BASIC APPLICANTS
exports.getAllApplicants = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM applicant_information`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching applicants:", err);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};

// ✅ GET SERVICE REQUEST APPLICANTS WITH FULL JOIN
exports.getServiceRequestApplicants = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ai.id, ai.fullName, ai.email, ai.age, ai.birthDate, ai.sex, ai.contactNumber,
        ai.social_media, ai.home_address, ai.profile_picture, ai.status,
        ai.service_request_id, ai.user_id,

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
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// ✅ UPDATE APPLICANT STATUS
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

// ✅ GET APPROVED APPLICANTS FOR LOGGED-IN CLIENT'S SERVICE REQUESTS
exports.getApprovedApplicants = async (req, res) => {
  try {
    const clientId = req.session.user?.user_id;
    if (!clientId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [rows] = await db.query(`
      SELECT 
        ai.*, aw.job_type, aw.years_experience, aw.tools_equipment,
        ad.primary_id_front, ad.primary_id_back, ad.secondary_id,
        ad.proof_of_address, ad.medical_certificate, ad.tesda_certificate
      FROM applicant_information ai
      LEFT JOIN applicant_workinfo aw ON ai.id = aw.applicant_id
      LEFT JOIN applicant_documents ad ON ai.id = ad.applicant_id
      WHERE ai.status = 'approved'
        AND ai.service_request_id IN (
          SELECT service_id FROM service_requests WHERE client_id = ?
        )
        AND ai.user_id != ? -- hide self-submitted applications
      ORDER BY ai.id DESC
    `, [clientId, clientId]);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching approved applicants:", error);
    res.status(500).json({ message: "Server error" });
  }
};
