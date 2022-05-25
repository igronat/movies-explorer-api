const JoiObjectId = require('joi-objectid');

const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

Joi.objectId = JoiObjectId(Joi);

const {
  createMovie,
  getMovies,
  deleteMovie,
  // likeCard,
  // dislikeCard,
} = require('../controllers/movies');

router.post('/movies', createMovie);
router.get('/movies', getMovies);
router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.objectId(),
  }),
}), deleteMovie);
// router.put('/cards/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.objectId(),
//   }),
// }), likeCard);
// router.delete('/cards/:cardId/likes', celebrate({
//   params: Joi.object().keys({
//     cardId: Joi.objectId(),
//   }),
// }), dislikeCard);

module.exports = router;
