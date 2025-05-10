const db = require('../db');

const createTasker = async (taskerData) => {
  await db.execute(`
    INSERT INTO tasker_personal (fullName, birthDate, age, gender, contactNumber, email, address, profilePicture, social_media)
    VALUES (?,?,?,?,?,?,?,?,?)
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

  await db.execute(`
    INSERT INTO tasker_professional (jobType, serviceCategory, experience, skills, tools_equipment)
    VALUES (?,?,?,?,?)
  `, [
    taskerData.jobType,
    taskerData.serviceCategory,
    taskerData.experience,
    taskerData.skills,
    taskerData.tools_equipment, // ✅ added here
  ]);

  await db.execute(`
    INSERT INTO tasker_documents (primaryIDFront, primaryIDBack, secondaryID, clearance, proofOfAddress, medicalCertificate, certificates)
    VALUES (?,?,?,?,?,?,?)
  `, [
    taskerData.primaryIDFront,
    taskerData.primaryIDBack,
    taskerData.secondaryID,
    taskerData.clearance,
    taskerData.proofOfAddress,
    taskerData.medicalCertificate,
    taskerData.certificates,
  ]);

  await db.execute(`
    INSERT INTO tasker_government (tinNumber, sssNumber, philHealthNumber, pagIbigNumber)
    VALUES (?,?,?,?)
  `, [
    taskerData.tinNumber,
    taskerData.sssNumber,
    taskerData.philHealthNumber,
    taskerData.pagIbigNumber,
  ]);
};

const fetchTaskersWithFullInfo = async () => {
  const [taskers] = await db.query(`
    SELECT 
      tp.id,
      tp.fullName,
      tp.age,
      tp.gender,
      tp.profilePicture,
      tf.jobType,
      tf.serviceCategory,
      tf.experience,
      tf.tools_equipment,
      tp.status
    FROM tasker_personal tp
    LEFT JOIN tasker_professional tf ON tp.id = tf.id
  `);
  return taskers;
};

module.exports = { 
  createTasker,
  fetchTaskersWithFullInfo
};
