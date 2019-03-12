"use strict"
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');

const ACCESS_AUD = 'access';
const REFRESH_AUD = 'refresh';
const ISSUER =  process.env.SERVER_NAME || 'IT-Reporting';
const CERT = process.env.SERVER_CERT ? fs.readFileSync(process.env.SERVER_CERT) : process.env.SECRET;
const KEY = process.env.SERVER_KEY ? fs.readFileSync(process.env.SERVER_KEY) : process.env.SECRET;
// expiration values are in seconds
const ACCESS_EXP = 60*60 // 1 hour expiration
const REFRESH_EXP = 60*60*24*30 // 30 day expiration

/*
  use symmetrical encryption if a secret exists,
  otherwise assume an asymmetric key pair
*/
const ALGORITHM = process.env.SECRET ? 'HS256' : 'RS256';


exports.verifyRefreshToken = (token, callback, cert=CERT) => {
  return jwt.verify(token, cert, { iss: ISSUER, aud: REFRESH_AUD },
    callback);
}

// throws Invalid Signature if signature is bad
exports.verifyAccessToken = (token, callback, cert=CERT) => {
  return jwt.verify(token, cert, { iss: ISSUER, aud: ACCESS_AUD },
    callback);
}

exports.generateRefreshToken = (id, callback, exp=REFRESH_EXP, key=KEY) => {
  return jwt.sign(
    {
      iss: ISSUER,
      sub: id,
      aud: REFRESH_AUD,
      exp: Math.floor(Date.now() / 1000) + exp
    },
    process.env.SECRET,
    {
        algorithm: ALGORITHM
    }, callback
  );
}

exports.generateAccessToken = (refreshToken, callback, exp=ACCESS_EXP,
  key=KEY, cert=CERT) => {
  if(callback) {
    return new Promise((resolve, reject) => {
      this.verifyRefreshToken(refreshToken, (err, decoded) => {
        if(err) { reject(err); }
        resolve(jwt.sign(
          {
            iss: ISSUER,
            sub: decoded.sub,
            aud: ACCESS_AUD,
            exp: Math.floor(Date.now() / 1000) + exp
          },
          key,
          {
            algorithm: ALGORITHM
          }, callback
        ));
      }, cert);
    })
  } else {
    try {
      console.log(cert, KEY, ALGORITHM);
      let decoded = this.verifyRefreshToken(refreshToken, null, cert);
      return jwt.sign(
        {
          iss: ISSUER,
          sub: decoded.sub,
          aud: ACCESS_AUD,
          exp: Math.floor(Date.now() / 1000) + exp
        },
        key,
        {
          algorithm: ALGORITHM
        }
      );
    } catch(err) {
      throw err;
    }
  }
}