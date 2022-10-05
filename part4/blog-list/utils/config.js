require('dotenv').config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_URL;
module.exports = { PORT, MONGO_URL };