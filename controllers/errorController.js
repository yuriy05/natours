const AppError = require('../utils/appError');

function handleCastDBError(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}

function handleDuplicateDBError(err) {
  const value = err.errmsg.match(/"([^"]*)"/)[0];
  const message = `Duplicate name field: ${value}, please use another value!`;
  return new AppError(message, 400);
}

function handleValidationDBError(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
}

function handleJWTToken(err) {
  return new AppError('Invalid token, please try again', 401);
}

function handleJWTExpiredError(err) {
  return new AppError('Your token has expired, please log in again', 401);
}

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  console.log(err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server!',
    });
  }
}

module.exports = (err, req, res, next) => {
  // console.error(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err,
      name: err.name,
      errmsg: err.errmsg,
      message: err.message,
      // validationErrors: err.errors.name,
    };

    if (error.name === 'CastError') {
      error = handleCastDBError(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateDBError(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationDBError(error);
    }

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTToken(error);
    }

    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
    }

    sendErrorProd(error, res);
  }
};
