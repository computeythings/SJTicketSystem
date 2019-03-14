"use strict"
require('dotenv').config();
if(process.env.NODE_ENV === 'TEST') {
  process.env.USERS_DATABASE = ':memory:';
  process.env.REPORTS_DATABASE = ':memory:';
}

require('./app/middleware/auth.js');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon');
const app = express();

if(process.env.NODE_ENV === 'TEST') {
  process.env.USERS_DATABASE = ':memory:';
  process.env.REPORTS_DATABASE = ':memory:';
}


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'app/views'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.png')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(session({
  secret:'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(require('./app/routes/index'));
app.use(require('./app/routes/login'));
app.use(require('./app/routes/users'));
app.use(require('./app/routes/reports'));

app.listen(8000, () => {
  console.log('Server running on http://localhost:8000/')
});
