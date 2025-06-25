const { query } = require('./db');
const { v4: uuidv4 } = require('uuid');

async function createTeacher({ user_id, department, specialization }) {
  const teacher_id = uuidv4();
  await query`
    INSERT INTO Teachers (teacher_id, user_id, department, specialization)
    VALUES (${teacher_id}, ${user_id}, ${department}, ${specialization})
  `;
  return teacher_id;
}

async function getTeacherByUserId(user_id) {
  const result = await query`SELECT * FROM Teachers WHERE user_id = ${user_id}`;
  return result.recordset[0];
}

module.exports = { createTeacher, getTeacherByUserId };