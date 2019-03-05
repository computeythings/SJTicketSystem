require('dotenv').config();
const fs = require('fs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const TokenHandler = require('./tokenhandler.js');
const jwt = require('jsonwebtoken');

var cert, key;
if (process.env.NODE_ENV === 'production') {
  cert = fs.readFileSync(process.env.SERVER_CERT);
  key = fs.readFileSync(process.env.SERVER_KEY);
} else {
  cert = key = process.env.TEST_SECRET;
}

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
}));

passport.use(new JWTStrategy({
  jwtFromRequest: req => req.cookies.jwt,
  secretOrKey: cert
}, (jwtPayload, done) => {
  jwt.verify(jwtPayload, cert, (err, decoded) => {
    if (err) { return done(err.message); }
    return done(null, jwtPayload);
  });
}));
