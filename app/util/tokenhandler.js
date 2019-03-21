"use strict"
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');

const ISSUER =  process.env.SERVER_NAME || 'IT-Reports';
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
  return jwt.verify(token, cert, { iss: ISSUER, aud: REFRESH_AUD },
    callback);
}

// throws Invalid Signature if signature is bad
exports.verifyAccessToken = (token, callback, cert=CERT) => {
  if(!token)
    throw new Error('TokenExistenceError');
  return jwt.verify(token, cert, { iss: ISSUER, aud: ACCESS_AUD },
    callback);
}

exports.verifyAdminToken = (token, callback, cert=CERT) => {
  if(!token)
    throw new Error('TokenExistenceError');
  return jwt.verify(token, cert, { iss: ISSUER, aud: ACCESS_AUD},
    (err, decoded) => {
      if (!decoded.admin)
        return callback(new Error('ACCESS DENIED'));
      callback(err, decoded);
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
      if(err) { resolve(err); }
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
        }, callback
      ));
    }, cert);
  });
}
