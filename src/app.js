"use strict";
const express = require('express');
const app = express();
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
dotenv.config();

const sessionOptions = {
  secret: 'test-secret',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if(app.get('env') === 'production') {
  sessionOptions.cookie.secure = true;
}

const strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'https://localhost/callback'
  },
  function(accessToken, refreshToken, options, profile, done) {
    return done(null, profile);
  }
);

passport.use(strategy);
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

var userInViews = require('../lib/middleware/userInViews');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);
