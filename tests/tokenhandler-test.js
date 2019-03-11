"user strict"
const assert = require('assert');
const tokens = require('../util/tokenhandler.js');

describe('tokenhandler.js', () => {
  var refreshToken;
  describe('#generateRefreshToken(user)', () => {
    it('should successfully generate a refresh token given a username', async () => {
      refreshToken = await tokens.generateRefreshToken('testUser');
      assert(tokens.verifyRefreshToken(refreshToken));
    });
  });
  describe('#generateAccessToken(refreshToken)', () => {
    it('should successfully generate an access token given a valid refresh token', done => {
      try {
        tokens.generateAccessToken(refreshToken);
        done();
      } catch (err) {
        done(err);
      }
    });
    it('should fail to generate an access token given an invalid refresh token', done => {
        tokens.generateAccessToken('I.AM.FAKE').then(res => {
          done(new Error('Failed to reject fake token'));
        }).catch(err => {
          try {
            assert(err.name === 'JsonWebTokenError');
            done();
          } catch (err) {
            done(err);
          }
        });
    });
  });
});
