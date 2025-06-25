const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const slotRoutes = require('./routes/slotRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const materialsRoutes = require('./routes/materialsRoutes');
const authRoutes = require('./routes/authRoutes');
const { getPool } = require('./models/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Віддаємо файли з папки uploads (наприклад, завантажені файли)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Підключаємо API роутери
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/auth', authRoutes);

// Віддаємо статичні файли з папки frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Для всіх маршрутів, що не починаються з /api, віддаємо frontend/index.html
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'), (err) => {
    if (err) {
      console.error('Помилка при віддачі index.html:', err);
      res.status(500).send('Виникла помилка сервера');
    }
  });
});

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Щось пішло не так!' });
});

const PORT = process.env.PORT || 3000;

// Створюємо папку uploads, якщо її немає
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function startServer() {
  try {
    await getPool();
    console.log('Connected to SQL Server');

    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Помилка підключення до бази даних:', error);
    process.exit(1);
  }
}

startServer();
