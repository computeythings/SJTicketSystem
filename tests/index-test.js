"use strict";
const assert = require('assert');
const web = require('../app.js');

describe('index.js', () => {
  describe('GET /', () => {
    it('should 301 redirect unauthenitcated browsers');
    it('should resolve a status 200 for authenticated browsers');
  });
  describe('GET /', () => {
    it('should 301 redirect authenitcated browsers');
    it('should resolve a status 200 for unauthenitcated browsers');
  });

  describe('POST /login', () => {
    it('should resolve 401 on a bad login');
    it('should 301 redirect to to main page on a successful login');
  });
});
