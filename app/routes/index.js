"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('*', (req, res, next) => {
  if(req.url === '/login') {
    return next();
  }
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/login'
  })(req, res, next);
})

router.get('/', (req, res) => {
  res.render('index', {
    title: 'IT Reporting'
  });
});

module.exports = router;
