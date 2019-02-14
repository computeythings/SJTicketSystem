"use strict"

const sql = require('sqlite3');

module.exports = class Reports {
  constructor(dbLocation) {
    this.db = new sql.Database(dbLocation);
    this.db.run(
        'CREATE TABLE IF NOT EXISTS reports ' +
        '(category TEXT, requestedBy TEXT, title TEXT, description TEXT, ' +
        'date INTEGER)'
      );
  }

  insertReport(category, requestedBy, title, description, date) {
    this.db.run(
      'INSERT INTO reports (category, requestedBy, title, description, date) ' +
      'VALUES ($category, $requestedBy, $title, $description, $date)', {
        $category: category,
        $requestedBy: requestedBy,
        $title: title,
        $description: description,
        $date: date
      });
  }

  editReport(id, category, requestedBy, title, description, date) {
    this.db.run(
      'UPDATE reports SET category = $category, ' +
      'requestedBy = $requestedBy,' +
      'title = $title,' +
      'description = $description,' +
      'date = $date' + , {
        $category: category,
        $requestedBy: requestedBy,
        $title: title,
        $description: description,
        $date: date
      });
  }

  deleteReport(id) {
    this.db.run('DELETE FROM reports WHERE rowid=?', id, (err) => {
      if (err)
        console.error(err);
      else
        console.log(`Row deleted ${this.changes}`);
    });
  }

  close() {
    this.db.close((err) => {
      if (err)
        console.error(err);
    });
  }
}
