"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const DATABASE = process.env.REPORTS_DATABASE || ':memory:';

var initialized = false;
const db = new sql.Database(DATABASE);
db.run('CREATE TABLE IF NOT EXISTS reports ' +
'(category TEXT, requestedBy TEXT, subject TEXT, description TEXT, ' +
'assignedTo TEXT, closed INTEGER, date INTEGER)', err => {
  if(!err)
    initialized = true;
});

exports.all = () => {
  return new Promise((resolve, reject) => {
    var reportsList = [];
    db.each('SELECT ROWID, * FROM reports ORDER BY date DESC', (err, row) => {
      if (err) { reject(err); }
      reportsList.push(row);
    }, err => {
      if (err) { reject(err); }
      resolve(reportsList);
    });
  })
}

exports.allOpen = () => {
  return new Promise((resolve, reject) => {
    var reportsList = [];
    db.each('SELECT * FROM reports WHERE closed != 1', (err, row) => {
      if (err) { reject(err); }
      reportsList.push(row);
    }, err => {
      if (err) { reject(err); }
      resolve(reportsList);
    });
  })
}

exports.addReport = report => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO reports (category, requestedBy, subject, description, ' +
      'assignedTo, closed, date) ' +
      'VALUES ($category, $requestedBy, $subject, $description, ' +
      '$assignedTo, $closed, $date)', {
        $category: report.category,
        $requestedBy: report.requestedBy,
        $subject: report.subject,
        $description: report.description,
        $assignedTo: report.assignedTo,
        $closed: report.closed,
        $date: report.date
      }, function(err) {
        if(err) {
          console.error(err);
          reject(err);
          return;
        }
        resolve(this.lastID);
    });
  });
}

exports.updateReport = (id, report) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE reports SET category = $category, ' +
      'requestedBy = $requestedBy,' +
      'subject = $subject,' +
      'description = $description,' +
      'assignedTo = $assignedTo' +
      'closed = $closed' +
      'date = $date', {
        $category: report.category,
        $requestedBy: report.requestedBy,
        $subject: report.subject,
        $description: report.description,
        $assignedTo: report.assignedTo,
        $closed: report.closed,
        $date: report.date
      }, function(err) {
        if(err)
          reject(err);
        resolve(this.lastID);
      });
  });
}

exports.deleteReport = id => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM reports WHERE rowid=?', id, function(err) {
      if (err)
        reject(err);
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
