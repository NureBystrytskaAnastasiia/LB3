const express = require('express');
const router = express.Router();
const { getSlots, addSlot, getAvailableSlots } = require('../controllers/slotsController');

router.get('/teacher/:teacherId', getSlots);
router.get('/available', getAvailableSlots);
router.post('/', addSlot);

module.exports = router;
