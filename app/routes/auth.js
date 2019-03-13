"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();
const tokens = require('../util/tokenhandler');

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: true }, (err, user) => {
    if (err) {
      res.status(301).redirect('/login');
      return;
    }

    req.login(user, { session: false }, (err) => {
      if (err) { res.status(400).json({ err }); }
      let refresh = tokens.generateRefreshToken(user.username);
      let access = tokens.generateAccessToken(refresh);

      res.cookie('jwt', access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION'
      });
      // res.status(301).redirect(req.session.returnTo || '/');
      res.status(301).redirect('/complete');
    });
  })(req, res);
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'IT Reporting - Login',
    header: 'IT Reporting'
  });
});

module.exports = router;
