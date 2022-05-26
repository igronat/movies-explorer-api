// const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ValidationError = require('../errors/validationError');
const ConflictError = require('../errors/conflictError');
const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password || !password) {
    throw new ValidationError('Пароль, имя и почта не могут быть пустыми');
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    // вернём записанные в базу данные
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Пароль и почта не могут быть пустыми');
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });

      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('В доступе отказано'));
    });
};

// module.exports.getUsers = (req, res, next) => {
//   User.find({})
//     .then((user) => res.send(user))
//     .catch(next);
// };

// возвращает информацию о пользователе (email и имя)
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

// module.exports.getUserId = (req, res, next) => {
//   User.findById(req.params.userId)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Пользователь с таким id не найден');
//       }
//       res.send(user);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new ValidationError('Введен некорректный id'));
//       }
//       next(err);
//     });
// };

// обновляет информацию о пользователе (email и имя)
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

// module.exports.updateAvatar = (req, res, next) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { avatar },
//     {
//       new: true, // обработчик then получит на вход обновлённую запись
//       runValidators: true, // данные будут валидированы перед изменением
//     },
//   )
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new ValidationError('Переданы некорректные данные'));
//       }
//       next(err);
//     });
// };
