"use strict"
const jwt = require('jsonwebtoken');
const fs = require('fs');

const ISSUER =  'IT-Reports';
const ACCESS_AUD = 'access';
const REFRESH_AUD = 'refresh';

var cert, key;
if (process.env.NODE_ENV === 'production') {
  cert = fs.readFileSync(process.env.SERVER_CERT);
  key = fs.readFileSync(process.env.SERVER_KEY);
} else {
  cert = key = process.env.TEST_SECRET;
}

// throws Invalid Signature if signature is bad
module.verifyRefreshToken = (token, callback) => {
  return jwt.verify(token, cert, { iss: ISSUER, aud: REFRESH_AUD }, callback);
}

// throws Invalid Signature if signature is bad
module.verifyAccessToken = (token, callback) => {
    return jwt.verify(token, cert,
      { iss: ISSUER, aud: ACCESS_AUD }, callback);
}

module.generateRefreshToken = (user, expr) => {
  return jwt.sign(
    {
      iss: ISSUER,
      sub: user,
      aud: REFRESH_AUD
    },
    key,
    {
        algorithm: 'RS256',
        expiresIn: '30d'
    }
  );
}

module.generateAccessToken = (refreshToken, expr) => {
  verifyRefreshToken(refreshToken, (err, decoded) => {
    if (err) {
      console.error(err);
      return false;
    }
    return jwt.sign(
      {
        iss: ISSUER,
        sub: user,
        aud: ACCESS_AUD
      },
      key,
      {
        algorithm: 'RS256',
        expiresIn: '1h'
      }
    );
  });
}
