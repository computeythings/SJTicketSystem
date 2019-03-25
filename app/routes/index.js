"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

// Routes which require admin credentials
const RESTRICTED_ROUTES = ['/users*', '/reports/add*'];

// authenticate when accessing any URL
router.get('*', (req, res, next) => {
  // pass unauthenticated to /login
  if(req.url === '/login') {
    return next();
  }

  passport.authenticate(['jwt', 'jwt_refresh'], (err, result, data) => {
    if (err || !result) {
      req.session.returnTo = req.url;
    }

    if(data && data.message && data.message === 'JWT REFRESH') {
      res.cookie('jwt', result, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'PRODUCTION'
        });
    }
    return next();
  })(req, res, next);
});

// restrict access
RESTRICTED_ROUTES.forEach((route) => {
  router.get(route, (req, res, next) => {
    passport.authenticate('jwt_admin', (err, result, data) => {
      if (err || ! result)
        return res.status(401).send('You dont have permission to access this.');
      return next();
    })(req, res, next);
  });
});

// restrict POSTing to any URL
router.post('*', (req, res, next) => {
  // pass unauthenticated to /login
  if(req.url === '/login') {
    return next();
  }

  passport.authenticate('jwt_admin', (err, result, data) => {
    if (err || !result)
      return res.status(401).send('You do not have permission to modify this.');
    return next();
  })(req, res, next);
});

router.get('/', (req, res) => {
  res.redirect('/reports');
});

module.exports = router;
