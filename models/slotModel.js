const { query } = require('./db');

async function getSlotsByTeacher(teacher_id) {
  const result = await query`SELECT * FROM Slots WHERE teacher_id = ${teacher_id}`;
  return result.recordset;
}

async function getAllSlots() {
  const result = await query`SELECT * FROM Slots`;
  return result.recordset;
}

async function createSlot({ slot_id, teacher_id, start_time, end_time, status }) {
  await query`
    INSERT INTO Slots (slot_id, teacher_id, start_time, end_time, status)
    VALUES (${slot_id}, ${teacher_id}, ${start_time}, ${end_time}, ${status})
  `;
}
async function getAvailableSlots() {
  const result = await query`
    SELECT s.*, u.first_name as teacher_name 
    FROM Slots s
    JOIN Teachers t ON s.teacher_id = t.teacher_id
    JOIN Users u ON t.user_id = u.user_id
    WHERE s.status = 'available'
  `;
  return result.recordset;
}

module.exports = { getSlotsByTeacher, getAllSlots, createSlot,getAvailableSlots };
