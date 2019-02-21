const express = require('express');
const router = express.Router();
const passport = require('passport');
const tokens = require('../tokenhandler.js');
const jwt = require('jsonwebtoken');

router.get('/login', passport.authenticate('jwt', { session: false }),
  (req,res) => {
    if (req.cookies.jwt) {
      token.verify(req.cookies.jwt, (err, decoded) => {
        if (!err)
          res.redirect(301, '/');
      });
    }
    res.send('TODO: LOGIN PAGE')
  });

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) { res.status(400).json({ err }); }

    req.login(payload, { session: false }, (error) => {
      if (error) { res.status(400).send({ error }); }

      const token = tokens.generate(user.username);
      res.cookie('jwt', jwt, { httpOnly: true, secure: true });
      res.status(200).send({ username });
    });
  })(req, res);
});


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;
