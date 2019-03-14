"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

// authenticate when accessing any URL
router.get('*', (req, res, next) => {
  // pass unauthenticated to /login
  if(req.url === '/login') {
    return next();
  }
  req.session.returnTo = req.url;
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login'
  })(req, res, next);
});

// authenticate when POSTing to any URL
router.post('*', (req, res, next) => {
  // pass unauthenticated to /login
  if(req.url === '/login') {
    return next();
  }
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login'
  })(req, res, next);
});

router.get('/', (req, res) => {
  res.render('index', {
    title: 'IT Reporting'
  });
});

module.exports = router;
