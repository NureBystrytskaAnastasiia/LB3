const express = require('express');
const router = express.Router();
const { getBookingsStudent, getBookingsTeacher, addBooking, updateBooking } = require('../controllers/bookingsController');
const { authenticate, authorize } = require('../authMiddleware');

router.get('/student/:studentId', authenticate, getBookingsStudent);
router.get('/teacher/:teacherId', authenticate, authorize(['teacher']), getBookingsTeacher);
router.post('/', authenticate, authorize(['student']), addBooking);
// Додаємо логування для діагностики
router.use((req, res, next) => {
  console.log(`Bookings route: ${req.method} ${req.path}`);
  next();
});

router.patch('/:bookingId', authenticate, updateBooking);

module.exports = router;