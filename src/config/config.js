const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  db_key: process.env.DB_KEY,
  db_login: process.env.DB_LOGIN,
  port: process.env.PORT
};