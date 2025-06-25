const { v4: uuidv4 } = require('uuid');
const { getMaterialsByTeacher, createMaterial } = require('../models/materialsModel');
const path = require('path');
const fs = require('fs');

async function getMaterials(req, res) {
  const { teacherId } = req.params;
  try {
    const materials = await getMaterialsByTeacher(teacherId);
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні матеріалів' });
  }
}

async function uploadMaterial(req, res) {
  const { teacher_id } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ message: 'Файл не надіслано' });
  }

  try {
    // Створюємо безпечне ім'я файлу
    const safeFileName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '');
    const newFilePath = path.join('uploads', `${Date.now()}-${safeFileName}`);
    
    // Переміщуємо файл до папки uploads
    fs.renameSync(req.file.path, path.join(__dirname, '..', newFilePath));

    await createMaterial({
      file_id: uuidv4(),
      teacher_id,
      name: req.file.originalname,
      file_type: req.file.mimetype,
      file_path: newFilePath.replace(/\\/g, '/'), // Замінюємо зворотні слеші для URL
    });

    res.json({ message: 'Матеріал завантажено' });
  } catch (err) {
    console.error('Upload error:', err);
    
    // Видаляємо файл, якщо сталася помилка
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Помилка при завантаженні матеріалу' });
  }
}

module.exports = { getMaterials, uploadMaterial };
