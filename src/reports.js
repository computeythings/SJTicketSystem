"use strict"

const sql = require('sqlite3');

module.exports = class Reports {
  constructor(dbLocation) {
    this.dbLocation = dbLocation;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db = new sql.Database(this.dbLocation);
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
        }, (err) => {
          if(err)
            reject(err);
          resolve(this.changes);
      });
    });
  }

  editReport(id, report) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE reports SET category = $category, ' +
        'requestedBy = $requestedBy,' +
        'title = $title,' +
        'description = $description,' +
        'date = $date' + , {
          $category: report.category,
          $requestedBy: report.requestedBy,
          $title: report.title,
          $description: report.description,
          $date: report.date
        }, (err) => {
          if(err)
            reject(err);
          resolve(this.changes);
        });
    });
  }

  deleteReport(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM reports WHERE rowid=?', id, (err) => {
        if (err)
          reject(err);
        resolve(this.changes);
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
