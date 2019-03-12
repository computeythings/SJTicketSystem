"use strict"
const assert = require('assert');
const reports = require('../controllers/reports.js');
const Report = require('../models/report.js')

const testReport = new Report(
  'Test Title',
  'Test User',
  'Test Category',
  'This is my test description.',
  Date.now()
);

// Before we start, we want to make sure the database has been initialized
before((done) => {
  (function start() {
    if(reports.initialized()) {
      done();
    } else {
      setTimeout(start, 100);
    }
  })();
});

after(() => {
  reports.close();
});

describe('reports.js', () => {
  describe('#addReport(report)', () => {
    it('should successfully add a test report', (done) => {
      reports.addReport(testReport).then((inserted) => {
        assert.equal(inserted, 1);
        done();
      }).catch(err => {
        done(err);
      });
    });
  });
  describe('#all()', () => {
    it('should return a list of all reports', done => {
      reports.all().then(res => {
        done();
      }).catch(err => {
        done(err);
      })
    });
  });
});
