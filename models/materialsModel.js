const { query } = require('./db');

async function getMaterialsByTeacher(teacher_id) {
  const result = await query`SELECT * FROM Materials WHERE teacher_id = ${teacher_id}`;
  return result.recordset;
}

async function createMaterial({ file_id, teacher_id, name, file_type, file_path }) {
  await query`
    INSERT INTO Materials (file_id, teacher_id, name, file_type, file_path)
    VALUES (${file_id}, ${teacher_id}, ${name}, ${file_type}, ${file_path})
  `;
}

module.exports = { getMaterialsByTeacher, createMaterial };
