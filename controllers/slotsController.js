const { v4: uuidv4 } = require('uuid');
const {
  getSlotsByTeacher,
  getAllSlots,
  createSlot,
  getAvailableSlots: getAvailableSlotsFromModel // <-- перейменовано тут
} = require('../models/slotModel');

async function getSlots(req, res) {
  const { teacherId } = req.params;
  try {
    if (teacherId) {
      console.log(`[getSlots] Отримання слотів викладача: ${teacherId}`);
      const slots = await getSlotsByTeacher(teacherId);
      return res.json(slots);
    }
    console.log('[getSlots] Отримання всіх слотів');
    const slots = await getAllSlots();
    res.json(slots);
  } catch (err) {
    console.error('[getSlots] Помилка:', err);
    res.status(500).json({ message: 'Помилка при отриманні слотів' });
  }
}

async function addSlot(req, res) {
  const { teacher_id, start_time, end_time, status } = req.body;
  console.log('[addSlot] Отримано дані для створення слоту:', { teacher_id, start_time, end_time, status });
  try {
    const newSlot = {
      slot_id: uuidv4(),
      teacher_id,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      status: status || 'available',
    };
    console.log('[addSlot] Створюємо слот:', newSlot);
    await createSlot(newSlot);
    console.log('[addSlot] Слот успішно створено');
    res.json({ message: 'Слот додано' });
  } catch (err) {
    console.error('[addSlot] Помилка при створенні слоту:', err);
    res.status(500).json({ message: 'Помилка при створенні слоту' });
  }
}
async function getAvailableSlots(req, res) {
  try {
    console.log('[getAvailableSlots] Отримання доступних слотів');
    const slots = await getAvailableSlotsFromModel(); // <-- використовуємо модель
    res.json(slots);
  } catch (err) {
    console.error('[getAvailableSlots] Помилка:', err);
    res.status(500).json({ message: 'Помилка при отриманні доступних слотів' });
  }
}

module.exports = { getSlots, addSlot,getAvailableSlots };
