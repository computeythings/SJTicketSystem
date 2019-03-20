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

  passport.authenticate(['jwt', 'jwt_refresh'], (err, result, data) => {
    if (err || !result) {
      req.session.returnTo = req.url;
      return res.status(301).redirect('/login');
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
