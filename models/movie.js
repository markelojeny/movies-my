const { Schema, model } = require('mongoose');
const { isURL } = require('validator');

const movieSchema = new Schema(
  {
    country: {
      type: String,
      required: [true, 'Поле "country" должно быть заполнено'],
    },
    director: {
      type: String,
      required: [true, 'Поле "director" должно быть заполнено'],
    },
    duration: {
      type: Number,
      required: [true, 'Поле "duration" должно быть заполнено'],
    },
    year: {
      type: String,
      required: [true, 'Поле "year" должно быть заполнено'],
    },
    description: {
      type: String,
      required: [true, 'Поле "description" должно быть заполнено'],
    },
    image: {
      type: String,
      required: [true, 'Поле "image" должно быть заполнено'],
      validate: [isURL, 'Некорректный URL'],
    },
    trailerLink: {
      type: String,
      required: [true, 'Поле "trailerLink" должно быть заполнено'],
      validate: [isURL, 'Некорректный URL'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Поле "thumbnail" должно быть заполнено'],
      validate: [isURL, 'Некорректный URL'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Поле "owner" должно быть заполнено'],
    },
    movieId: {
      type: Number,
      required: [true, 'Поле "movieId" должно быть заполнено'],
    },
    nameRU: {
      type: String,
      required: [true, 'Поле "nameRU" должно быть заполнено'],
      validate: {
        validator(value) {
          return /^[\u0400-\u04FF\s]+$/.test(value);
        },
        message: 'Используйте кириллицу',
      },
    },
    nameEN: {
      type: String,
      required: [true, 'Поле "nameEN" должно быть заполнено'],
      validate: {
        validator(value) {
          return /^[A-Za-z\s]+$/.test(value);
        },
        message: 'Используйте литиницу',
      },
    },
  },
  { versionKey: false },
);

module.exports = model('movie', movieSchema);
