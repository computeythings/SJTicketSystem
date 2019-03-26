"use strict"
require('dotenv').config();
process.env.SERVER_NAME = 'TEST_SERVER_NAME';
process.env.SECRET = 'S3KRET';

const jwt = require('jsonwebtoken');
const tokens = require('../app/util/tokenhandler.js');
const assert = require('assert');

const testID = 'tester';
const fakeSecret = 'FAKE-S3KRET';
var tokenRef,tokenAcc,fakeTokenRef,fakeTokenAcc,expiredRef,expiredAcc;

describe('tokenhandler.js', () => {

  describe('#generateRefreshToken(id)', () => {

    it('should generate a valid token given an id', () => {
      tokenRef = tokens.generateRefreshToken(testID);
      fakeTokenRef = tokens.generateRefreshToken(testID, null, 60*60*24*30,
        fakeSecret);
      expiredRef = tokens.generateRefreshToken(testID, null, -3600);
      assert(jwt.verify(tokenRef, process.env.SECRET));
    });
  });

  describe('#generateAccessToken(refreshToken, id)', () => {

    it('should generate an access token given a valid refresh token', () => {
      tokenAcc = tokens.generateAccessToken(tokenRef, testID);
      fakeTokenAcc = tokens.generateAccessToken(fakeTokenRef, testID, null,
        60*60*24*30, fakeSecret, fakeSecret);
      expiredAcc = tokens.generateAccessToken(tokenRef, testID, null, -3600);
      assert(jwt.verify(tokenRef, process.env.SECRET));
    });

    it('should fail to generate an access token given falsified refresh token',
    done => {
      tokens.generateAccessToken(fakeTokenRef, testID).then(res => {
        done(Error('Failed to reject falsified token'));
      }).catch(err => {
        assert.equal(err.name, 'JsonWebTokenError');
        done();
      });
    });
  });

  describe('#verifyRefreshToken(token, id)', () => {

    it('should return true if a token is valid', () => {
      assert(tokens.verifyRefreshToken(tokenRef, testID));
    });

    it('should throw an error if a token was falsified', done => {
      // I couldn't get assert.throws to work here to this is the workaround
      try {
        tokens.verifyRefreshToken(fakeTokenRef, testID);
        done(Error('Failed to reject falsified token'));
      } catch(err) {
        assert.equal(err.name, 'JsonWebTokenError');
        done();
      }
    });

    it('should throw an error if a token is expired', done => {
      // I couldn't get assert.throws to work here to this is the workaround
      try {
        tokens.verifyRefreshToken(expiredRef, testID);
        done(Error('Failed to reject falsified token'));
      } catch(err) {
        assert.equal(err.name, 'TokenExpiredError');
        done();
      }
    });
  });

  describe('#verifyAccessToken(token, id)', () => {

    it('should return true if a token is valid', () => {
      assert(tokens.verifyAccessToken(tokenAcc, testID));
    });

    it('should throw an error if a token was falsified', done => {
      // I couldn't get assert.throws to work here to this is the workaround
      try {
        tokens.verifyAccessToken(fakeTokenAcc, testID);
        done(Error('Failed to reject falsified token'));
      } catch(err) {
        assert.equal(err.name, 'JsonWebTokenError');
        done();
      }
    });

    it('should throw an error if a token is expired', done => {
      // I couldn't get assert.throws to work here to this is the workaround
      try {
        tokens.verifyAccessToken(expiredAcc, testID);
        done(Error('Failed to reject falsified token'));
      } catch(err) {
        assert.equal(err.name, 'TokenExpiredError');
        done();
      }
    });
  });
});
