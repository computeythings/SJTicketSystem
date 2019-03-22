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
'assignedTo TEXT, closed INTEGER, date INTEGER, comments TEXT DEFAULT \'\')',
err => {
  if(!err)
    initialized = true;
});

exports.all = () => {
  return new Promise((resolve, reject) => {
    var reportsList = [];
    db.each('SELECT ROWID, * FROM reports ORDER BY date DESC', (err, row) => {
      if (err) { reject(err); }
      reportsList.push(new Report(row));
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
      reportsList.push(new Report(row));
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
      'assignedTo, closed, date, comments) ' +
      'VALUES ($category, $requestedBy, $subject, $description, ' +
      '$assignedTo, $closed, $date, $comments)', {
        $category: report.category,
        $requestedBy: report.requestedBy,
        $subject: report.subject,
        $description: report.description,
        $assignedTo: report.assignedTo,
        $closed: report.closed,
        $date: report.date,
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
      db.run(
        'UPDATE reports SET category = $category, ' +
        'requestedBy = $requestedBy, ' +
        'subject = $subject, ' +
        'description = $description, ' +
        'assignedTo = $assignedTo, ' +
        'closed = $closed, ' +
        'date = $date, ' +
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
