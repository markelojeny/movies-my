const router = require('express').Router();

const { validationUpdateProfile } = require('../middlewares/validation');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', validationUpdateProfile, updateUser);

module.exports = router;
