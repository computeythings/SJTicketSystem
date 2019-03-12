const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;

const tokens = require('../tokenhandler.js');


passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      let loginSuccess = await login(username, password);
      if (loginSuccess) {
        return done(null, username);
      }
      return done(null, false, { message: 'Incorrect username or password.' });
    } catch(err) {
      done(err);
    }
  });
);

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: keys.public
  }, (jwtPayload, done) => {
    tokens.verifyAccessToken(jwtPayload, keys.public, (err, decoded) => {
      if (err) { return done(err.message); }
      return done(null, jwtPayload);
    });
  })
);

module.exports = passport;
