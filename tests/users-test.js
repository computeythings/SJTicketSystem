"use strict"
require('dotenv').config();
process.env.USERS_DATABASE = ':memory:';
const assert = require('assert');
const users = require('../app/controllers/users.js');
const User = require('../app/models/user.js');

const testUser = new User("testerson", "testPassword", false);


// Before we start, we want to make sure the database has been initialized
before((done) => {
  (function() {
    if(users.initialized()) {
      done();
    } else {
      setTimeout(this, 100);
    }
  })();
});

after(() => {
  users.close();
});

var userRowID;
describe('users.js', () => {
  describe('#addUser(user)', () => {
    it('should successfully add a test user', (done) => {
      users.addUser(testUser).then((result) => {
        if (result) {
          userRowID = result;
          done();
        }
      }).catch(err => {
        done(err);
      });
    });
  });
  describe('#getUser(name)', () => {
    it('should return the info of the user requested', done => {
      users.getUser(testUser.name).then(result => {
        done();
      }).catch(err => {
        done(err);
      })
    });
  });
  describe('#login(user, password)', () => {
    it('should successfully login the test user', done => {
      users.login(testUser.name, testUser.password).then(result => {
        if(result)
          done();
      }).catch(err => {
        done(err);
      });
    });
  });
});
