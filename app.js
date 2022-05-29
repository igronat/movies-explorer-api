require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');

const app = express();
const { PORT = 3000 } = process.env;
const { DataBase = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/notFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const auth = require('./middlewares/auth');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

// подключаемся к серверу mongo
mongoose.connect(DataBase, {
  useNewUrlParser: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(require('./routes/login'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

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
