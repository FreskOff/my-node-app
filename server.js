// server.js (полный код)

require('dotenv').config(); // Подключаем .env для конфиденциальных данных
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

// Настройки конфиденциальных данных
const botToken = process.env.BOT_TOKEN || 'ваш_токен_бота';
const chatId = process.env.CHAT_ID || 'ваш_ID_чата';

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

// Раздача статических файлов
app.use(express.static(__dirname));

// Маршрут для проверки работы сервера
app.get('/health', (req, res) => {
    res.send('Сервер работает корректно!');
});

// Обработка POST-запроса с формы
app.post('/send-message', async (req, res) => {
    console.log('Получен запрос:', req.body);

    let { name, phone, message } = req.body;

    if (!message) {
        console.error('Отсутствует поле message');
        return res.status(400).send({ message: 'Поле message обязательно.' });
    }

    if (!name) name = '';
    if (!phone) phone = '';

    const text = `Имя: ${name}\nТелефон: ${phone}\nСообщение: ${message}`;

    try {
        const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text,
        });
        console.log('Сообщение успешно отправлено:', response.data);
        return res.status(200).send({ message: 'Сообщение успешно отправлено!' });
    } catch (error) {
        if (error.response) {
            console.error('Ошибка от Telegram API:', error.response.data);
        } else {
            console.error('Сетевая ошибка или ошибка Axios:', error.message);
        }
        return res.status(500).send({ message: 'Ошибка при отправке сообщения.' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
