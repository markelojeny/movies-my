const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');

const { CREATED, OK } = require('../utils/errors');

const NotFoundError = require('../errors/NotFoundError');

const ValidationError = require('../errors/ValidationError');

const TakenEmailError = require('../errors/TakenEmailError');

module.exports.getUser = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .then((user) => {
      res.status(OK).json({ data: user });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.updateUser = (req, res, next) => {
  const owner = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (req.body._id === owner) {
        return res.status(OK).json({ data: user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError(`Некорректные данные: + ${error.message}`));
      }
      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({ data: user.toJSON() }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ValidationError(`Некорректные данные: + ${error.message}`));
      } else if (error.code === 11000) {
        next(new TakenEmailError('Такой mail уже есть базе данных'));
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthError('Необходима авторизация'));
      }
      bcrypt.compare(String(password), user.password)
        .then((matched) => {
          if (!matched) {
            next(new AuthError('Необходима авторизация'));
          }

          const token = jwt.sign(
            {
              _id: user._id,
            },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
          );
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            expiresIn: '7d',
            httpOnly: true,
            sameSite: true,
          });
          res.send({ data: user.toJSON() });
        });
    })
    .catch((err) => next(err));
};

module.exports.logout = (req, res) => {
  res.status(202).clearCookie('jwt').send({ message: 'cookie-cleared' });
};
