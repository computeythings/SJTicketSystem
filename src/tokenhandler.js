"use strict"
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');

const ISSUER =  'IT-Reports';
const ACCESS_AUD = 'access';
const REFRESH_AUD = 'refresh';

var ALGORITHM = 'RS256';
var cert, key;
if (process.env.NODE_ENV === 'production') {
  cert = fs.readFileSync(process.env.SERVER_CERT);
  key = fs.readFileSync(process.env.SERVER_KEY);
} else {
  cert = key = process.env.TEST_SECRET;
  ALGORITHM = 'HS256';
}

// throws Invalid Signature if signature is bad
exports.verifyRefreshToken = (token, callback=undefined) => {
  if (callback)
    return jwt.verify(token, cert, { iss: ISSUER, aud: REFRESH_AUD }, callback);
  return jwt.verify(token, cert, { iss: ISSUER, aud: REFRESH_AUD });
}

// throws Invalid Signature if signature is bad
exports.verifyAccessToken = (token, callback=undefined) => {
  if(callback)
    return jwt.verify(token, cert, { iss: ISSUER, aud: ACCESS_AUD }, callback);
  return jwt.verify(token, cert, { iss: ISSUER, aud: ACCESS_AUD });
}

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    {
      iss: ISSUER,
      sub: user,
      aud: REFRESH_AUD
    },
    key,
    {
        algorithm: ALGORITHM,
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
        key,
        {
          algorithm: ALGORITHM,
          expiresIn: '1h'
        }
      ));
    });
  });
}
