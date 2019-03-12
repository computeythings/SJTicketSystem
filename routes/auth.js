"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();
const tokens = require('../util/tokenhandler');

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) { res.status(400).json({ err }); }

    req.login(user.username, { session: false }, (err) => {
      if (err) { res.status(400).send({ err }); }
      let refresh = tokens.generateRefreshToken(user.username);
      let access = tokens.generateAccessToken(refresh);

      res.cookie('jwt', access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION'
      });
      res.status(200).send({ user });
    });
  })(req, res);
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'IT Reporting - Login'
  });
});

module.exports = router;
