require('dotenv').config();

const { PORT } = process.env;
const MONGODB_URL = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
module.exports = { PORT, MONGO_URL: MONGODB_URL };