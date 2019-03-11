"use strict"

const sql = require('sqlite3');
const DATABASE = process.env.REPORTS_DATABASE || ':memory:';

module.exports = class Reports {
  init() {
    return new Promise((resolve, reject) => {
      this.db = new sql.Database(DATABASE);
      this.db.run(
        'CREATE TABLE IF NOT EXISTS reports ' +
        '(category TEXT, requestedBy TEXT, title TEXT, description TEXT, ' +
        'date INTEGER)', (err) => {
            if (err)
              reject(err);
            resolve(this);
          });
    });
  }

  all() {
    return new Promise((resolve, reject) => {
      var reportsList = [];
      this.db.each('SELECT * FROM reports', (err, row) => {
        if (err) { reject(err); }
        reportsList.push(row);
      }, err => {
        if (err) { reject(err); }
        resolve(reportsList);
      });
    })
  }

  addReport(report) {
    return new Promise((resolve, reject) => {
      this.db.run(
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

  updateReport(id, report) {
    return new Promise((resolve, reject) => {
      this.db.run(
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

  deleteReport(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM reports WHERE rowid=?', id, function(err) {
        if (err)
          reject(err);
        resolve(this.lastID);
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err)
        console.error(err);
    });
  }
}
