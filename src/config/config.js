const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  db_key: process.env.DB_KEY,
  db_login: process.env.DB_LOGIN,
  port: process.env.PORT,

  storage_type: process.env.STORAGE_TYPE,

  aws_access_key: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  bucket_name: process.env.BUCKET_NAME,
  aws_default_region: process.env.AWS_DEFAULT_REGION
};
