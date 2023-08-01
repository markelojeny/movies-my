const Movie = require('../models/movie');

const { CREATED, OK } = require('../utils/errors');

const NotFoundError = require('../errors/NotFoundError');

const ValidationError = require('../errors/ValidationError');

const AccessDeniedError = require('../errors/AccessDeniedError');

module.exports.getMovies = (req, res, next) => {
  const currentUser = req.user;
  Movie.find({ owner: currentUser._id })
    .then((movie) => {
      res.status(OK).json(movie);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        return Movie.deleteOne({ _id })
          .then(() => {
            res.status(OK).json(movie);
          });
      }
      throw new AccessDeniedError('Нет прав на удаление карточки');
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const movieData = { ...req.body };
  const owner = req.user._id;

  Movie.create({ ...movieData, owner })
    .then((movie) => res.status(CREATED).json(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError(`Некорректные данные: + ${error.message}`));
      }
      return next(error);
    });
};
