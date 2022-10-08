const config = require('./utils/config');
const logger = require('./utils/logger');
const blogRouter = require('./controllers/blogs');
const mongoose = require('mongoose')
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const app = express();
mongoose.connect(config.MONGO_URL).then(() => {
    logger.info('mongo connect');
}).catch(error => {
    logger.error('error connecting to MongoDB:', error.message);
});

app.use(cors());
app.use(express.json());``
app.use(morgan('tiny'))

app.use('/api/blogs',blogRouter);
module.exports = app;