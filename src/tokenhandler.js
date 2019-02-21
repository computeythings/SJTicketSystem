"use strict"
const jwt = require('jsonwebtoken');

module.exports = class TokenGenerator {
    constructor(cert, key) {
        this.cert = cert;
        this.key = key;
    }
    generate(user, expr) {
      if(!expr) { expr = '1d'; }
      return jwt.sign({ username: user }, this.key,
      {
          algorithm: 'RS256',
          expiresIn: expr
      });
    }
    // throws Invalid Signature if signature is bad
    verify(token, callback) {
        return jwt.verify(token, this.cert, callback);
    }
}
