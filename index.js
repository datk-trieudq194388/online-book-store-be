const express = require('express');
const morgan = require('morgan');
const db = require('./src/configs/db');
const route = require('./src/routes');
const {PORT} = require('./src/configs/config');
const cookieParser = require('cookie-parser');

const app = express();

/* connect db */ 
db.connect();

app.use(cookieParser()); // for parsing cookies from header
app.use(express.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(express.json());  // for parsing application/json

/* http logger */
app.use(morgan('combined'));

/* router init */
route(app);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});