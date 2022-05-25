const Movie = require('../models/movies');
const ValidationError = require('../errors/validationError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(next);
};

// создаёт фильм с переданными в теле country, director, duration, year, description, image, trailerLink, nameRU, nameEN и thumbnail, movieId
module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (movie == null) {
        throw new NotFoundError('Фильм с таким id не найден');
      }
      if (!(movie.owner.toString() === req.user._id)) {
        throw new ForbiddenError('У вас нет прав на удаление этого фильма');
      }
      return Movie.findByIdAndRemove(req.params._id)
        .then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Введен некорректный id фильма'));
      }
      next(err);
    });
};

// module.exports.likeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
//     { new: true },
//   )
//     .then((card) => {
//       if (card == null) {
//         throw new NotFoundError('Карточка с таким id не найдена');
//       }
//       res.send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new ValidationError('Введен некорректный id карточки'));
//       }
//       next(err);
//     });
// };

// module.exports.dislikeCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } }, // убрать _id из массива
//     { new: true },
//   )
//     .then((card) => {
//       if (card == null) {
//         throw new NotFoundError('Карточка с таким id не найдена');
//       }
//       res.send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new ValidationError('Введен некорректный id карточки'));
//       }
//       next(err);
//     });
// };
