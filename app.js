const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Global middlewares

// Set secutiry HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data sanitization against NoSQL query injection
// This middleware looks at req.body and req.query, req.params
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'maxGroupSize',
      'difficulty',
    ],
  })
);

// app.use((req, res, next) => {
//   console.log(req.headers);

//   next();
// });

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Not found middleware
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can not found ${req.originalUrl} on the server!`,
  // });

  // const err = new Error(`Can not found ${req.originalUrl} on this server!`);
  // err.status = 'failed';
  // err.statusCode = 404;

  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;
