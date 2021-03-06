"use strict"
const jwt = require('jsonwebtoken');
const fs = require('fs');
const users = require('../controllers/users.js');
const User = require('../models/user.js');

const ISSUER =  process.env.SERVER_NAME;
const CERT = process.env.SECRET ? process.env.SECRET : fs.readFileSync(process.env.SERVER_CERT);
const KEY = process.env.SECRET ? process.env.SECRET : fs.readFileSync(process.env.SERVER_KEY);
// expiration values are in seconds
const ACCESS_EXP = 60*60 // 1 hour expiration
const REFRESH_EXP = 60*60*24*30 // 30 day expiration
const ACCESS_AUD = 'access';
const REFRESH_AUD = 'refresh';

/*
  use symmetrical encryption if a secret exists,
  otherwise assume an asymmetric key pair
*/
const ALGORITHM = process.env.SECRET ? 'HS256' : 'RS256';


exports.verifyRefreshToken = (token, callback, cert=CERT) => {
  if(!token)
    return Error('TokenExistenceError');
  return jwt.verify(token, cert, { issuer: ISSUER, audience: REFRESH_AUD },
    callback);
}

// throws Invalid Signature if signature is bad
exports.verifyAccessToken = (token, callback, cert=CERT) => {
  if(!token)
    throw new Error('TokenExistenceError');

  return jwt.verify(token, cert, { issuer: ISSUER, audience: ACCESS_AUD },
    callback);
}

exports.verifyAdminToken = (token, callback, cert=CERT) => {
  if(!token)
    throw new Error('TokenExistenceError');

  return exports.verifyAccessToken(token, (err, decoded) => {
      if (!decoded || !decoded.admin)
        return callback(new Error('ACCESS DENIED'));
      return callback(err, decoded);
    });
}

exports.generateRefreshToken = (user, callback, exp=REFRESH_EXP, key=KEY) => {
  return jwt.sign(
    {
      iss: ISSUER,
      sub: user.username,
      aud: REFRESH_AUD,
      admin: user.admin
    },
    key,
    {
        algorithm: ALGORITHM,
        expiresIn: exp
    }, callback
  );
}

exports.generateAccessToken = (refreshToken, callback, exp=ACCESS_EXP,
  key=KEY, cert=CERT) => {
  return new Promise((resolve, reject) => {
    this.verifyRefreshToken(refreshToken, (err, decoded) => {
      if(err) { return reject(err); }
      resolve(jwt.sign(
        {
          iss: ISSUER,
          sub: decoded.sub,
          aud: ACCESS_AUD,
          admin: decoded.admin
        },
        key,
        {
          algorithm: ALGORITHM,
          expiresIn: exp
        }, callback ? (accErr, accSigned) =>
              { callback(accErr, accSigned, decoded); } : null
      ));
    }, cert);
  });
}
