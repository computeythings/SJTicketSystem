"use strict"
const jwt = require('jsonwebtoken');
const fs = require('fs');

const ISSUER =  'IT-Reports';
const ACCESS_AUD = 'access';
const REFRESH_AUD = 'refresh';
const keys = require('../lib/keys.js');

// throws Invalid Signature if signature is bad
module.verifyRefreshToken = (token, callback) => {
  return jwt.verify(token, keys.public, { iss: ISSUER, aud: REFRESH_AUD }, callback);
}

// throws Invalid Signature if signature is bad
module.verifyAccessToken = (token, callback) => {
    return jwt.verify(token, keys.public,
      { iss: ISSUER, aud: ACCESS_AUD }, callback);
}

module.generateRefreshToken = (user, expr) => {
  return jwt.sign(
    {
      iss: ISSUER,
      sub: user,
      aud: REFRESH_AUD
    },
    keys.private,
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
      keys.private,
      {
        algorithm: 'RS256',
        expiresIn: '1h'
      }
    );
  });
}
