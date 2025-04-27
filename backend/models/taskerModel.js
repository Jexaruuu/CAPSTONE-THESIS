const db = require('../db');

const createTasker = async (taskerData) => {
  await db.execute(`
    INSERT INTO tasker_personal (fullName, birthDate, age, gender, contactNumber, email, address, profilePicture)
    VALUES (?,?,?,?,?,?,?,?)
  `, [
    taskerData.fullName,
    taskerData.birthDate,
    taskerData.age,
    taskerData.gender,
    taskerData.contactNumber,
    taskerData.email,
    taskerData.address,
    taskerData.profilePicture,
  ]);

  await db.execute(`
    INSERT INTO tasker_professional (jobType, serviceCategory, experience, skills)
    VALUES (?,?,?,?)
  `, [
    taskerData.jobType,
    taskerData.serviceCategory,
    taskerData.experience,
    taskerData.skills,
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

module.exports = { createTasker };
