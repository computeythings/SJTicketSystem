"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {
  session: false,
  failureRedirect: '/login'
}), (req, res) => {
  res.render('index', {
    title: 'IT Reporting'
  });
});

module.exports = router;
