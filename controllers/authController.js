const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');
const { createTeacher } = require('../models/teacherModel');

const JWT_SECRET = '123456789';

async function register(req, res) {
  const { first_name, email, password, role, department, specialization } = req.body;
  
  if (!first_name || !email || !password || !role) {
    return res.status(400).json({ message: 'Всі поля обов’язкові' });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач з таким email вже існує' });
    }

    const user_id = uuidv4();
    await createUser({ user_id, first_name, email, password, role });

    // Якщо це вчитель, створюємо запис у таблиці Teachers
    if (role === 'teacher') {
      await createTeacher({
        user_id,
        department: department || '',
        specialization: specialization || ''
      });
    }

    res.status(201).json({ message: 'Реєстрація пройшла успішно' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Помилка при реєстрації' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email і пароль потрібні' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Користувача не знайдено' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний пароль' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        first_name: user.first_name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Помилка при вході' });
  }
}

module.exports = { register, login };