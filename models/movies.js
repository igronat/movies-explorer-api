const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Некорректный url'],
  },
  trailerLink: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Некорректный url'],
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Некорректный url'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  // likes: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   default: [],
  // }],
});

module.exports = mongoose.model('movie', movieSchema);
