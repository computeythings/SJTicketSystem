"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const DATABASE = process.env.DATABASE || ':memory:';
const Ticket = require('../models/ticket.js');

var initialized = false;
const db = new sql.Database(DATABASE);
console.log('Opening tickets database at', DATABASE);
db.run('CREATE TABLE IF NOT EXISTS tickets ' +
'(category TEXT, requestedBy TEXT, subject TEXT, description TEXT, ' +
'assignedTo TEXT, closed INTEGER, date INTEGER)',
err => {
  if(!err)
    initialized = true;
});

exports.all = () => {
  return new Promise((resolve, reject) => {
    var ticketsList = [];
    db.each('SELECT ROWID, * FROM tickets ORDER BY date DESC', (err, row) => {
      if (err) { reject(err); }
      ticketsList.push(new Ticket(row));
    }, err => {
      if (err)
        reject(err);
      else
        resolve(ticketsList);
    });
  })
}

exports.allOpen = () => {
  return new Promise((resolve, reject) => {
    var ticketsList = [];
    db.each('SELECT ROWID, * FROM tickets WHERE closed != 1', (err, row) => {
      if (err) { reject(err); }
      ticketsList.push(new Ticket(row));
    }, err => {
      if (err)
        reject(err);
      else
        resolve(ticketsList);
    });
  })
}

exports.getTicket = id => {
  return new Promise((resolve, reject) => {
    db.get('SELECT ROWID, * FROM tickets WHERE rowid=?',
    id, (err, row) => {
      if (err)
        reject(err);
      else
        resolve(row);
    });
  });
}

exports.addTicket = ticket => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO tickets (category, requestedBy, subject, description, ' +
      'assignedTo, closed, date) ' +
      'VALUES ($category, $requestedBy, $subject, $description, ' +
      '$assignedTo, $closed, $date)', {
        $category: ticket.category,
        $requestedBy: ticket.requestedBy,
        $subject: ticket.subject,
        $description: ticket.description,
        $assignedTo: ticket.assignedTo,
        $closed: ticket.closed,
        $date: ticket.date
      }, function(err) {
        if(err)
          reject(err);
        else
          resolve(this.lastID);
    });
  });
}

exports.updateTicket = (id, set) => {
  return new Promise((resolve, reject) => {
    var sqlString = 'UPDATE tickets SET ';
    var values = [];
    exports.getTicket(id).then(result => {
      for(const key in set) {
        if(key === 'rowid')
          continue;
        sqlString += key + ' = ? ';
        values.push(set[key]);
      }

      sqlString += 'WHERE rowid = ?';
      values.push(id);

      db.run(sqlString, values, function(err) {
        if(err)
          reject(err);
        else
          resolve(this.lastID);
      });
    }).catch(err => {
      reject(err);
    });
  });
}

exports.closeTicket = id => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE tickets SET closed = 1 WHERE rowid = ?', id, function(err) {
      if(err)
        reject(err);
      else
        resolve(this.lastID);
    });
  });
}

exports.deleteTicket = id => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM tickets WHERE rowid=?', id, function(err) {
      if (err)
        reject(err);
      else
        resolve(this.lastID);
    });
  });
}

exports.close = () => {
  db.close((err) => {
    if (err)
      console.error(err);
  });
}

exports.initialized = () => {
  return initialized;
}
