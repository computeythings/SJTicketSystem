"use strict"
require('./app/middleware/auth.js');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'app/views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(session({
  secret:'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(require('./app/routes/reports'));
app.use(require('./app/routes/users'));
app.use(require('./app/routes/auth'));
app.use(require('./app/routes/index'));

app.listen(8000, () => {
  console.log('Server running on http://localhost:8000/')
});
