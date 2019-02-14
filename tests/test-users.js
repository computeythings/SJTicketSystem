"use strict"
const usersDB = require('../src/users.js');
const assert = require('assert');

const testUser = "testerson";
const testPwd = "testPassword";

async function runTests() {
  let users = await new usersDB(':memory:').init();
  describe('UsersDB', () => {
    it('should successfully add a test user', async () => {
      let addResult = await users.addUser(testUser, testPwd);
      assert(addResult);
    });

    it('should successfully login the test user', async () => {
      let loginResult = await users.login(testUser, testPwd);
      assert(loginResult);
    });
  });
  users.close();
}
runTests();
