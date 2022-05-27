const JoiObjectId = require('joi-objectid');

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

Joi.objectId = JoiObjectId(Joi);

const {
  login,
  createUser,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

module.exports = router;
