"use strict"
process.env.DATABASE = ':memory:';
const assert = require('assert');
const tickets = require('../app/controllers/tickets.js');
const Ticket = require('../app/models/ticket.js')

const testTicket = new Ticket(
  'Test Title',
  'Test User',
  'Test Category',
  'This is my test description.',
  Date.now()
);

// Before we start, we want to make sure the database has been initialized
before((done) => {
  (function start() {
    if(tickets.initialized()) {
      done();
    } else {
      setTimeout(start, 100);
    }
  })();
});

after(() => {
  tickets.close();
});

describe('tickets.js', () => {
  describe('#addTicket(ticket)', () => {
    it('should successfully add a test ticket', (done) => {
      tickets.addTicket(testTicket).then(inserted => {
        assert.equal(inserted, 1);
        done();
      }).catch(err => {
        done(err);
      });
    });
  });
  describe('#all()', () => {
    it('should return a list of all tickets', done => {
      tickets.all().then(res => {
        done();
      }).catch(err => {
        done(err);
      });
    });
  });
});
