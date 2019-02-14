"use strict"

const sql = require('sqlite3');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports = class Reports {
  constructor(dbLocation) {
    this.dbLocation = dbLocation;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db = new sql.Database(this.dbLocation);
      this.db.run(
          'CREATE TABLE IF NOT EXISTS users ' +
          '(user TEXT UNIQUE, password TEXT)', (err) => {
            if (err)
              reject(err);
            else
              resolve(this);
          });
    });
  }

  addUser(user, password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
          if (err)
            reject(err);
          this.db.run(
            'INSERT INTO users (user, password) ' +
            'VALUES ($user, $hash)', {
              $user: user,
              $hash: hash
            });
          resolve(true);
      });
    });
  }

  login(user, password) {
    return new Promise((resolve, reject) => {
      this.db.each('SELECT * FROM users WHERE user is ? LIMIT 1', user,
      (err, row) => {
        if (err)
          reject(err);
        else {
          bcrypt.compare(password, row.password, (err, res) => {
            if (res)
              resolve(true);
            else
              reject(err);
          });
        }
      });
    });
  }

  deleteUser(id) {
    this.db.run('DELETE FROM users WHERE rowid=?', id, (err) => {
      if (err)
        console.error(err);
      else
        console.log(`Row deleted ${this.changes}`);
    });
  }

  close() {
    console.log('Closing users database');
    this.db.close((err) => {
      if (err)
        console.error(err);
    });
  }
}
