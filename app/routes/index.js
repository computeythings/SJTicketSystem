"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

// Routes which require admin credentials
const RESTRICTED_ROUTES = ['/users*', '/tickets/add*'];

// authenticate when accessing any URL
router.get('*', (req, res, next) => {
  console.log('GET at',req.url,'from',req.connection.remoteAddress);
  // pass unauthenticated to /login
  if(req.url === '/login' || req.url === '/logout') {
    return next();
  }
  if(req.url === '/favicon.ico') {
    res.status(204);
    return next();
  }

  passport.authenticate('jwt', (err, result, data) => {
    if (err || !result) {
      req.session.returnTo = req.url;
    }
    if(data && data.message && data.message === 'JWT REFRESH') {
      res.cookie('jwt', result, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'PRODUCTION',
          overwrite: true
        });
      req.cookies.jwt = result;
    }
    return next();
  })(req, res, next);
});

// restrict access
RESTRICTED_ROUTES.forEach((route) => {
  router.get(route, (req, res, next) => {
    passport.authenticate('jwt_admin', (err, result, data) => {
      if (err || ! result) {
        return res.status(401).send('You dont have permission to access this.');
      }
      return next();
    })(req, res, next);
  });
});

// restrict POSTing to any URL
router.post('*', (req, res, next) => {
  console.log('POST at',req.url,'from',req.connection.remoteAddress);
  // pass unauthenticated to /login
  if(req.url === '/login') {
    return next();
  }

  if(req.url === '/account/update') {
    req.body.username = req.session.user;
    return next();
  }

  passport.authenticate('jwt_admin', (err, result, data) => {
    if (err || !result)
      return res.status(401).send('You do not have permission to modify this.');
    return next();
  })(req, res, next);
});

module.exports = router;
