"use strict"
const usersDB = require('../src/users.js');
const assert = require('assert');

const testUser = "testerson";
const testPwd = "testPassword";

var users;
before((done) => {
  new usersDB(':memory:').init().then((db) => {
    users = db;
    done();
  });
});

after(() => {
  users.close();
});

describe('UsersDB', () => {
  describe('#addUser(user,pass)', () => {
    it('should successfully add a test user', (done) => {
      users.addUser(testUser, testPwd).then((result) => {
        if (result)
          done();
      }).catch(err => {
        done(err);
      });
    });
  });
  describe('#login(user,pass)', () => {
    it('should successfully login the test user', (done) => {
      users.login(testUser, testPwd).then((result) => {
        if(result)
          done();
      }).catch(err => {
        done(err);
      });
    });
  });
});
