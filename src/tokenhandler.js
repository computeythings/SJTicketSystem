"use strict"
const jwt = require('jsonwebtoken');
const fs = require('fs');
const keys = require('../lib/keys.js');

const ISSUER =  'IT-Reports';
const ACCESS_AUD = 'access';
const REFRESH_AUD = 'refresh';
// throws Invalid Signature if signature is bad
exports.verifyRefreshToken = (token, callback=undefined) => {
  if (callback)
    return jwt.verify(token, keys.public, { iss: ISSUER, aud: REFRESH_AUD }, callback);
  return jwt.verify(token, keys.public, { iss: ISSUER, aud: REFRESH_AUD });
}

// throws Invalid Signature if signature is bad
exports.verifyAccessToken = (token, callback=undefined) => {
  if(callback)
    return jwt.verify(token, keys.public, { iss: ISSUER, aud: ACCESS_AUD }, callback);
  return jwt.verify(token, keys.public, { iss: ISSUER, aud: ACCESS_AUD });
}

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      iss: ISSUER,
      sub: user,
      aud: REFRESH_AUD
    },
    keys.private,
    {
        algorithm: keys.algorithm,
        expiresIn: '30d'
    }
  );
}

exports.generateAccessToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    exports.verifyRefreshToken(refreshToken, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(jwt.sign(
        {
          iss: ISSUER,
          sub: refreshToken,
          aud: ACCESS_AUD
        },
        keys.private,
        {
          algorithm: keys.algorithm,
          expiresIn: '1h'
        }
      ));
    });
  });
}
