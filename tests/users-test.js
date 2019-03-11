"use strict"
const usersDB = require('../controllers/users.js');
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

describe('users.js', () => {
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
  describe('#getUser(user)', () => {
    it('should return the info of the user requested', done => {
      users.getUser(testUser).then(result => {
        done();
      }).catch(err => {
        done(err);
      })
    });
  });
  describe('#login(user,pass)', () => {
    it('should successfully login the test user', done => {
      users.login(testUser, testPwd).then(result => {
        if(result)
          done();
      }).catch(err => {
        done(err);
      });
    });
  });
});
