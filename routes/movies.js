const JoiObjectId = require('joi-objectid');

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

Joi.objectId = JoiObjectId(Joi);

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.post('/movies', celebrate({
  params: Joi.object().keys({
    country: Joi.string(),
    director: Joi.string(),
    duration: Joi.string(),
    year: Joi.number(),
    description: Joi.string(),
    image: Joi.string().pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    trailerLink: Joi.string().pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
    thumbnail: Joi.string().pattern(/^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    movieId: Joi.number(),
  }),
}), createMovie);
router.get('/movies', getMovies);
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.objectId(),
  }),
}), deleteMovie);

module.exports = router;
