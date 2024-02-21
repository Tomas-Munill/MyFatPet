const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');

const loginRouter = require('./controllers/loginController');
const usersRouter = require('./controllers/usersContorller');
const mealsRouter = require('./controllers/mealsController');
const petsRouter = require('./controllers/petsController');

const app = express();

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => logger.info('connected to MongoDB'))
  .catch((error) => logger.error('error conecting to MongoDB', error.message));

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/pets', middleware.userExtractor, petsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
