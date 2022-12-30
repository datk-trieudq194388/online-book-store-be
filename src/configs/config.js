require('dotenv').config();

const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT || "") || 10;
const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY || "";
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || "";
const PORT = process.env.PORT;
const DB_USER = process.env.DB_USER ;
const DB_PWD = process.env.DB_PWD ;
const DB_NAME = process.env.DB_NAME;

module.exports = {PORT, DB_USER, DB_PWD, DB_NAME, BCRYPT_SALT, ACCESS_SECRET_KEY, REFRESH_SECRET_KEY};