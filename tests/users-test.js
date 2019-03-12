"use strict"
const assert = require('assert');
const usersDB = require('../controllers/users.js');
const User = require('../models/user.js');

const testUser = new User("testerson", "testPassword");


var users;
before((done) => {
  new usersDB().init().then((db) => {
    users = db;
    done();
  });
});

after(() => {
  users.close();
});

describe('users.js', () => {
  describe('#addUser(user)', () => {
    it('should successfully add a test user', (done) => {
      users.addUser(testUser).then((result) => {
        if (result)
          done();
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
  describe('#login(user)', () => {
    it('should successfully login the test user', done => {
      users.login(testUser).then(result => {
        if(result)
          done();
      }).catch(err => {
        done(err);
      });
    });
  });
});
