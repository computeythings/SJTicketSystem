"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const DATABASE = process.env.REPORTS_DATABASE || ':memory:';

var initialized = false;
const db = new sql.Database(DATABASE);
db.run('CREATE TABLE IF NOT EXISTS reports ' +
'(category TEXT, requestedBy TEXT, title TEXT, description TEXT, ' +
'date INTEGER)', err => {
  if(!err)
    initialized = true;
});

exports.all = () => {
  return new Promise((resolve, reject) => {
    var reportsList = [];
    db.each('SELECT * FROM reports', (err, row) => {
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
      'INSERT INTO reports (category, requestedBy, title, description, date) ' +
      'VALUES ($category, $requestedBy, $title, $description, $date)', {
        $category: report.category,
        $requestedBy: report.requestedBy,
        $title: report.title,
        $description: report.description,
        $date: report.date
      }, function(err) {
        if(err)
          reject(err);
        resolve(this.lastID);
    });
  });
}

exports.updateReport = (id, report) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE reports SET category = $category, ' +
      'requestedBy = $requestedBy,' +
      'title = $title,' +
      'description = $description,' +
      'date = $date', {
        $category: report.category,
        $requestedBy: report.requestedBy,
        $title: report.title,
        $description: report.description,
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
