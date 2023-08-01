const dotenv = require('dotenv');

dotenv.config();

const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { errors } = require('celebrate');

const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/errors');

const app = express();
app.use(express.json());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/filmdb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT} port`);
});
