"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const DATABASE = process.env.DATABASE || ':memory:';
const Report = require('../models/report.js');

var initialized = false;
const db = new sql.Database(DATABASE);
console.log('Opening reports database at', DATABASE);
db.run('CREATE TABLE IF NOT EXISTS reports ' +
'(category TEXT, requestedBy TEXT, subject TEXT, description TEXT, ' +
'assignedTo TEXT, closed INTEGER, date INTEGER, dateString TEXT, ' +
'timeString TEXT, comments TEXT DEFAULT \'\')',
err => {
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
      if (err)
        reject(err);
      else
        resolve(reportsList);
    });
  })
}

exports.allOpen = () => {
  return new Promise((resolve, reject) => {
    var reportsList = [];
    db.each('SELECT ROWID, * FROM reports WHERE closed != 1', (err, row) => {
      if (err) { reject(err); }
      reportsList.push(row);
    }, err => {
      if (err)
        reject(err);
      else
        resolve(reportsList);
    });
  })
}

exports.getReport = id => {
  return new Promise((resolve, reject) => {
    db.get('SELECT ROWID, * FROM reports WHERE rowid=?',
    id, (err, row) => {
      if (err)
        reject(err);
      else
        resolve(row);
    });
  });
}

exports.addReport = report => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO reports (category, requestedBy, subject, description, ' +
      'assignedTo, closed, date, dateString, timeString, comments) ' +
      'VALUES ($category, $requestedBy, $subject, $description, ' +
      '$assignedTo, $closed, $date, $dateString, $timeString, $comments)', {
        $category: report.category,
        $requestedBy: report.requestedBy,
        $subject: report.subject,
        $description: report.description,
        $assignedTo: report.assignedTo,
        $closed: report.closed,
        $date: report.date,
        $dateString: report.dateString,
        $timeString: report.timeString,
        $comments: report.comments
      }, function(err) {
        if(err)
          reject(err);
        else
          resolve(this.lastID);
    });
  });
}

exports.updateReport = (id, values) => {
  return new Promise((resolve, reject) => {
    console.log('EDITTING REPORT', id);
    exports.getReport(id).then(result => {
      let report = new Report(result);
      for(const key in values) {
        switch(key) {
          case 'rowid':
            continue;
          case 'comments':
            report.addComment(values[key]);
            break;
          case 'closed':
            report[key] = values[key] === 'update' ? 0 : 1;
            break;
          default:
            report[key] = values[key];
        }
      }
      console.log('final report', report);
      db.run(
        'UPDATE reports SET category = $category, ' +
        'requestedBy = $requestedBy, ' +
        'subject = $subject, ' +
        'description = $description, ' +
        'assignedTo = $assignedTo, ' +
        'closed = $closed, ' +
        'date = $date, ' +
        'dateString = $dateString, ' +
        'timeString = $timeString, ' +
        'comments = $comments ' +
        'WHERE rowid=$id', {
          $id: id,
          $category: report.category,
          $requestedBy: report.requestedBy,
          $subject: report.subject,
          $description: report.description,
          $assignedTo: report.assignedTo,
          $closed: report.closed,
          $date: report.date,
          $dateString: report.dateString,
          $timeString: report.timeString,
          $comments: JSON.stringify(report.comments)
        }, function(err) {
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

exports.deleteReport = id => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM reports WHERE rowid=?', id, function(err) {
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
