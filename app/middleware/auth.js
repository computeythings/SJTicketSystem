const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom');
const users = require('../controllers/users.js');
const tokens = require('../util/tokenhandler.js');


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      let loginSuccess = await users.login(username, password);
      console.log('LOGIN', loginSuccess);
      if (loginSuccess) {
        return done(null, loginSuccess);
      }
      return done(new Error('Incorrect username or password.'));
    } catch(err) {
      done(err);
    }
  })
);

passport.use('jwt', new CustomStrategy((req, done) => {
  if(!req.cookies || !req.cookies.jwt)
    return done(null, false, {message: 'No JWT'});

  tokens.verifyAccessToken(req.cookies.jwt, (err, decoded) => {
    if (err) { return done(err.message); }
    return done(null, decoded);
  });
}));
