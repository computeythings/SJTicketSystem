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
      if (loginSuccess) {
        return done(null, loginSuccess);
      }
      return done(new Error('Incorrect username or password.'));
    } catch(err) {
      done(err);
    }
  })
);

// used for each transaction after initial local authentication
passport.use('jwt', new CustomStrategy((req, done) => {
  if(!req.cookies || !req.cookies.jwt ||
     Object.entries(req.cookies.jwt).length === 0) {
    return done(null, false, {message: 'No JWT'});
  }

  tokens.verifyAccessToken(req.cookies.jwt, (err, decoded) => {
    if (err || !decoded) {
      if(!req.cookies.refresh_jwt)
        return done(null, false, { message: 'No auth method available'} );
      tokens.generateAccessToken(req.cookies.refresh_jwt,
        (err, signed, decoded) => {
          if (err) { return done(null, false, { message: err }); }
          req.session.user = decoded.sub;
          req.session.admin = decoded.admin;
          return done(null, signed, { message: 'JWT REFRESH' });
      });
    } else {
      req.session.user = decoded.sub;
      req.session.admin = decoded.admin;
      return done(null, decoded, { message: 'JWT ACCESS' });
    }
  });
}));

// used for each transaction after initial local authentication
passport.use('jwt_admin', new CustomStrategy((req, done) => {
  if(!req.cookies || !req.cookies.jwt ||
     Object.entries(req.cookies.jwt).length === 0) {
    return done(null, false, {message: 'No JWT'});
  }

  tokens.verifyAdminToken(req.cookies.jwt, (err, decoded) => {
    if (err) { return done(null, false, { message: err.message }); }
    req.session.user = decoded.sub;
    req.session.admin = decoded.admin;
    return done(null, decoded, { message: 'JWT ADMIN' });
  });
}));
