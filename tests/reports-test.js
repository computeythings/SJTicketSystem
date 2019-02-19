"use strict"
const reportsDB = require('../src/reports.js');
const assert = require('assert');

const testReport = {
  category: 'Test Category',
  requestedBy: 'Test User',
  title: 'Test Title',
  description: 'This is my test description.',
  date: Date.now()
};

var reports;
before((done) => {
  new reportsDB(':memory:').init().then((db) => {
    reports = db;
    done();
  });
});

after(() => {
  reports.close();
});

describe('ReportsDB', () => {
  describe('#addReport(report)', () => {
    it('should successfully add a test report', (done) => {
      reports.addReport(testReport).then((inserted) => {
        assert.equal(inserted, 1);
        done();
      }).catch(err => {
        done(err);
      });
    });
  })
});
