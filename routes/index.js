const router = require('express').Router();

const movieRouter = require('./movies');
const userRouter = require('./users');

const {
  createUser,
  login,
  logout,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

const { validationCreateUser, validationLogin } = require('../middlewares/validation');

const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.get('/signout', logout);
router.use('/', userRouter);
router.use('/', movieRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
