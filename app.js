"use strict"
require('dotenv').config();
if(!process.env.SERVER_NAME) { process.env.SERVER_NAME = 'IT-Ticketing' }
// for security purposes, we want a new server instance for each reboot
process.env.SERVER_NAME += Math.floor(Math.random() * 999999);
if(process.env.NODE_ENV === 'TEST') {
  process.env.DATABASE = ':memory:';
  process.env.SERVER_NAME = 'TEST-SERVER';
}

require('./app/middleware/auth.js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const favicon = require('serve-favicon');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'app/views'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.png')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('cookie-parser')());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(require('./app/routes/index'));
app.use(require('./app/routes/login'));
app.use(require('./app/routes/users'));
app.use(require('./app/routes/reports'));

if(process.env.SERVER_CERT && process.env.SERVER_KEY) {
    let port = process.env.NODE_PORT || 8443;
    https.createServer({
      key: fs.readFileSync(process.env.SERVER_KEY),
      cert: fs.readFileSync(process.env.SERVER_CERT)
    }, app).listen(port, () => {
      console.log('Server running on http://localhost:' + port);
    });
  }
else {
  let port = process.env.NODE_PORT || 8000;
  app.listen(port, () => {
    console.log('Server running on http://localhost:' + port);
  });
}
