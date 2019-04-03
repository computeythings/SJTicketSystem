"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();
const tokens = require('../util/tokenhandler');

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: true }, (err, user) => {
    if (err) {
      res.status(401).render('login', {
        title: 'IT Ticketing - Login',
        header: 'IT Ticketing',
        err: err
      });
      return;
    }

    req.login(user, { session: false }, async (err) => {
      if (err) {
        res.status(401).render('login', {
          title: 'IT Ticketing - Login',
          header: 'IT Ticketing',
          err: err
        });
      }
      let refresh = tokens.generateRefreshToken(user);
      let access = await tokens.generateAccessToken(refresh);

      res.cookie('refresh_jwt', refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION',
        expires: new Date(Date.now() + 60*60*24*30*1000)
      });
      res.cookie('jwt', access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'PRODUCTION'
      });
      req.session.user = user.username;
      req.session.admin = user.admin;
      res.status(301).redirect(req.session.returnTo || '/');
      delete req.session.returnTo;
    });
  })(req, res);
});

router.get('/login', (req, res) => {

  res.render('login', {
    title: 'IT Ticketing - Login',
    header: 'IT Ticketing'
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.clearCookie('refresh_jwt');
  delete req.session.returnTo;
  delete req.session.admin;
  delete req.session.user;
  res.status(301).redirect('/');
})

module.exports = router;
