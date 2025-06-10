const db = require('../db');

const createTasker = async (taskerData) => {
  // ✅ First, insert into tasker_personal and get the new ID
  const [result] = await db.execute(`
    INSERT INTO tasker_personal (fullName, birthDate, age, gender, contactNumber, email, address, profilePicture, social_media)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    taskerData.fullName,
    taskerData.birthDate,
    taskerData.age,
    taskerData.gender,
    taskerData.contactNumber,
    taskerData.email,
    taskerData.address,
    taskerData.profilePicture,
    taskerData.social_media,
  ]);

  const insertedId = result.insertId; // ✅ Get the inserted tasker ID

  // ✅ Insert into tasker_professional using the tasker ID
  await db.execute(`
    INSERT INTO tasker_professional (id, jobType, serviceCategory, experience, skills, tools_equipment, rate_per_hour)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    insertedId,
    taskerData.jobType,
    taskerData.serviceCategory,
    taskerData.experience,
    taskerData.skills,
    taskerData.tools_equipment,
    taskerData.rate_per_hour,
  ]);

  // ✅ Insert into tasker_documents using the tasker ID
  await db.execute(`
    INSERT INTO tasker_documents (id, primaryIDFront, primaryIDBack, secondaryID, clearance, proofOfAddress, medicalCertificate, certificates)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    insertedId,
    taskerData.primaryIDFront,
    taskerData.primaryIDBack,
    taskerData.secondaryID,
    taskerData.clearance,
    taskerData.proofOfAddress,
    taskerData.medicalCertificate,
    taskerData.certificates,
  ]);

  // ✅ Insert into tasker_government using the tasker ID
  await db.execute(`
    INSERT INTO tasker_government (id, tinNumber, sssNumber, philHealthNumber, pagIbigNumber)
    VALUES (?, ?, ?, ?, ?)
  `, [
    insertedId,
    taskerData.tinNumber,
    taskerData.sssNumber,
    taskerData.philHealthNumber,
    taskerData.pagIbigNumber,
  ]);
};

// ✅ Fetch full tasker info including parsed jobType & serviceCategory
const fetchTaskersWithFullInfo = async () => {
  const [rows] = await db.query(`
    SELECT 
      tp.id,
      tp.fullName,
      tp.age,
      tp.gender,
      tp.contactNumber,
      tp.email,
      tp.address,
      tp.status,
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
  `); // 🟢 removed status filtering

  return rows.map(tasker => {
    let jobTypeParsed = [];
    let serviceCategoriesParsed = {};

    try {
      jobTypeParsed = JSON.parse(tasker.jobType || "[]");
    } catch {
      jobTypeParsed = [];
    }

    try {
      serviceCategoriesParsed = JSON.parse(tasker.serviceCategory || "{}");
    } catch {
      serviceCategoriesParsed = {};
    }

    return {
      ...tasker,
      status: tasker.status?.toLowerCase(), // ✅ Normalize here
      jobType: jobTypeParsed,
      serviceCategory: serviceCategoriesParsed,
    };
  });
};

module.exports = { 
  createTasker,
  fetchTaskersWithFullInfo
};
