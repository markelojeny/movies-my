const { celebrate, Joi, Segments } = require('celebrate');

const { url } = require('../utils/regexUrl');

module.exports.validationUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports.validationCreateMovie = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(url),
    trailerLink: Joi.string().required().pattern(url),
    thumbnail: Joi.string().required().pattern(url),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().regex(/^[а-яА-ЯёЁ\s]+$/),
    nameEN: Joi.string().required().regex(/^[a-zA-Z\s]+$/),
  }),
});

module.exports.validationMovieId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});

module.exports.validationLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validationCreateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
