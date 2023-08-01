const handlerError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'Произошла ошибка на сервере'
        : message,
    });
  next();
};

module.exports = handlerError;
