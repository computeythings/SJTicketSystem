"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const DATABASE = process.env.USERS_DATABASE || ':memory:';

module.exports = class Reports {
  init() {
    return new Promise((resolve, reject) => {
      this.db = new sql.Database(DATABASE);
      this.db.run(
          'CREATE TABLE IF NOT EXISTS users ' +
          '(user TEXT UNIQUE, password TEXT, admin INTEGER)', (err) => {
            if (err)
              reject(err);
            else
              resolve(this);
          });
    });
  }

  addUser(user) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(user.password, SALT_ROUNDS, (err, hash) => {
          if (err)
            reject(err);
          this.db.run(
            'INSERT INTO users (user, password, admin) ' +
            'VALUES ($user, $hash, 0)', {
              $user: user.name,
              $hash: user.password
            });
          resolve(true);
      });
    });
  }

  login(user) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM users WHERE user is ?', user.name,
      (err, row) => {
        if (err)
          reject(err);
        else {
          bcrypt.compare(user.password, row.password, (err, res) => {
            if (res)
              resolve(res);
            else
              reject(err);
          });
        }
      });
    });
  }

  getUser(name) {
    return new Promise((resolve, reject) => {
      this.db.each('SELECT user, admin FROM users WHERE user is ? LIMIT 1',
      name, (err, row) => {
        if (err) { reject(err); }
        resolve(row);
      });
    });
  }

  deleteUser(name) {
    this.db.run('DELETE FROM users WHERE rowid=?', name, function(err) {
      if (err)
        console.error(err);
      else
        console.log(this.changes);
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
