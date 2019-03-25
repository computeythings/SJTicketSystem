"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

// Routes which require admin credentials
const RESTRICTED_ROUTES = ['/users*', '/reports/add*'];
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
