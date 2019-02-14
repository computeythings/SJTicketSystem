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

const testReport2 = {
  category: 'Test Category2',
  requestedBy: 'Test User2',
  title: 'Test Title2',
  description: 'This is my second test description.',
  date: Date.now() + 22
};

async function runTests() {
  let reports = await new reportsDB(':memory:').init();
  describe('ReportsDB', () => {
    it('should successfully add a test report', async () => {
      let addResult = await reports.addReport(testReport);
      assert.equal(addResult, testReport);
    });
  });
  reports.close();
}
runTests();
