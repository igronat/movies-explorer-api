const JoiObjectId = require('joi-objectid');

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

Joi.objectId = JoiObjectId(Joi);

const {
  getUsers,
  getUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// router.get('/users', getUsers);
router.get('/users/me', getUser);
// router.get('/users/:userId', celebrate({
//   params: Joi.object().keys({
//     userId: Joi.objectId(),
//   }),
// }), getUserId);
router.patch('/users/me', updateUser);
// router.patch('/users/me/avatar', celebrate({
//   body: Joi.object().keys({
//     avatar: Joi.string().required().pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
//   }),
// }), updateAvatar);

module.exports = router;
