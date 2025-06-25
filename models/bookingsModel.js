const { query } = require('./db');

async function getBookingsByStudent(student_id) {
  const result = await query`
    SELECT b.booking_id, b.booking_date, b.status, s.slot_id, s.start_time, s.end_time, t.teacher_id, u.first_name as teacher_name
    FROM Bookings b
    JOIN Slots s ON b.slot_id = s.slot_id
    JOIN Teachers t ON s.teacher_id = t.teacher_id
    JOIN Users u ON t.user_id = u.user_id
    WHERE b.student_id = ${student_id}
    ORDER BY s.start_time DESC
  `;
  return result.recordset;
}

async function getBookingsByTeacher(teacher_id) {
  const result = await query`
    SELECT b.booking_id, b.booking_date, b.status, s.start_time, s.end_time, u.user_id as student_id, u.first_name as student_name
    FROM Bookings b
    JOIN Slots s ON b.slot_id = s.slot_id
    JOIN Users u ON b.student_id = u.user_id
    WHERE s.teacher_id = ${teacher_id}
    ORDER BY s.start_time DESC
  `;
  return result.recordset;
}

async function createBooking({ booking_id, student_id, slot_id, status }) {
  await query`
    INSERT INTO Bookings (booking_id, student_id, slot_id, status)
    VALUES (${booking_id}, ${student_id}, ${slot_id}, ${status})
  `;
}

async function updateBookingStatus(booking_id, status) {
  const result = await query`
    UPDATE Bookings 
    SET status = ${status}
    WHERE booking_id = ${booking_id}
  `;
  return result.rowsAffected[0] > 0;
}

async function getBookingById(booking_id) {
  const result = await query`
    SELECT * FROM Bookings WHERE booking_id = ${booking_id}
  `;
  return result.recordset[0];
}

module.exports = { 
  getBookingsByStudent, 
  getBookingsByTeacher, 
  createBooking, 
  updateBookingStatus,
  getBookingById
};