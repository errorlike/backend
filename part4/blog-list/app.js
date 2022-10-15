const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const app = express();

console.log(config.MONGODB_URL);
mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    logger.info('mongo connect');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
module.exports = app;
