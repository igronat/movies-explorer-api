require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const {
  createUser,
  login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
  }),
}), createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('/', (req, res, next) => {
  next(new NotFoundError('Данный ресурс не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500

  const { statusCode = 500, message } = err;
  next(
    res
      .status(statusCode)
      .send({
      // проверяем статус и выставляем сообщение в зависимости от него
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      }),
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
