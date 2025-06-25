const { v4: uuidv4 } = require('uuid');
const { getBookingsByStudent, getBookingsByTeacher, createBooking, updateBookingStatus, getBookingById } = require('../models/bookingsModel');

async function getBookingsStudent(req, res) {
  const { studentId } = req.params;
  try {
    const bookings = await getBookingsByStudent(studentId);
    res.json(bookings);
  } catch (err) {
    console.error('Error getting student bookings:', err);
    res.status(500).json({ message: 'Помилка при отриманні бронювань' });
  }
}

async function getBookingsTeacher(req, res) {
  const { teacherId } = req.params;
  try {
    const bookings = await getBookingsByTeacher(teacherId);
    res.json(bookings);
  } catch (err) {
    console.error('Error getting teacher bookings:', err);
    res.status(500).json({ message: 'Помилка при отриманні бронювань' });
  }
}

async function addBooking(req, res) {
  const { student_id, slot_id, status } = req.body;
  try {
    await createBooking({
      booking_id: uuidv4(),
      student_id,
      slot_id,
      status: status || 'booked',
    });
    res.json({ message: 'Бронювання створено' });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Помилка при створенні бронювання' });
  }
}

async function updateBooking(req, res) {
  const { bookingId } = req.params;
  const { status } = req.body;
  
  console.log(`Updating booking ${bookingId} to status ${status}`);
  
  try {
    // Перевіряємо, чи існує бронювання
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }

    // Оновлюємо статус
    const updated = await updateBookingStatus(bookingId, status);
    if (!updated) {
      return res.status(400).json({ message: 'Не вдалося оновити бронювання' });
    }

    res.json({ message: 'Бронювання оновлено' });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ message: 'Помилка при оновленні бронювання' });
  }
}

module.exports = { 
  getBookingsStudent, 
  getBookingsTeacher, 
  addBooking, 
  updateBooking 
};