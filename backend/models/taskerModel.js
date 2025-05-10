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
      tf.rate_per_hour,
      tp.status
    FROM tasker_personal tp
    LEFT JOIN tasker_professional tf ON tp.id = tf.id
  `);

  return taskers.map(tasker => {
    let parsedJobType = [];
    let parsedServiceCategory = {};

    try {
      parsedJobType = tasker.jobType ? JSON.parse(tasker.jobType) : [];
    } catch {
      parsedJobType = [];
    }

    try {
      parsedServiceCategory = tasker.serviceCategory ? JSON.parse(tasker.serviceCategory) : {};
    } catch {
      parsedServiceCategory = {};
    }

    return {
      ...tasker,
      jobType: parsedJobType,
      serviceCategory: parsedServiceCategory,
      rate_per_hour: tasker.rate_per_hour ? parseFloat(tasker.rate_per_hour) : null
    };
  });
};

module.exports = { 
  createTasker,
  fetchTaskersWithFullInfo
};
