const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path'); // Додаємо імпорт модуля path
const { getMaterials, uploadMaterial } = require('../controllers/materialsController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    // Створюємо папку, якщо її немає
    const fs = require('fs'); // Додаємо імпорт fs для роботи з файловою системою
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Замінюємо небезпечні символи в імені файлу
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '');
    cb(null, Date.now() + '-' + safeFileName);
  }
});

const upload = multer({ storage });

router.get('/teacher/:teacherId', getMaterials);
router.post('/', upload.single('file'), uploadMaterial);

module.exports = router;