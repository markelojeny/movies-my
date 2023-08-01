const router = require('express').Router();

const { getMovies, deleteMovie, createMovie } = require('../controllers/movies');

const { validationCreateMovie, validationMovieId } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', validationCreateMovie, createMovie);
router.delete('/movies/:_id', validationMovieId, deleteMovie);

module.exports = router;
