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
  passport.authenticate('jwt', (err, result) => {
    if (err && err.name === 'TokenExpiredError') {
      passport.authenticate('jwt_refresh', { session: true }, (err, token) => {
        if (!token)
          return res.status(301).redirect('/login');
        else {
          // a valid jwt has now been issued
          res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PRODUCTION'
          });
          // pass user onto desired location
          return next();
        }
      })(req, res, next);
    }
    if (!result)
      return res.status(301).redirect('/login');
    else
      return next();
  })(req, res, next);


});




/*
{
  session: false,
  failureRedirect: '/login'
}
*/


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
