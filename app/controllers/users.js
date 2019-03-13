"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const SALT_ROUNDS = 10;
const DATABASE = process.env.USERS_DATABASE || ':memory:';

var initialized = false;
const db = new sql.Database(DATABASE);
db.run('CREATE TABLE IF NOT EXISTS users ' +
  '(username TEXT UNIQUE, password TEXT, admin INTEGER)', function(err) {
    if(!err) {
      exports.all().then((res) => {
        if(res.length === 0)
          exports.addUser(new User('admin', 'admin', true));
        initialized = true;
      });
    }
  });

exports.all = () => {
  return new Promise((resolve, reject) => {
    var usersList = [];
    db.each('SELECT * FROM users', (err, row) => {
      if (err) { reject(err); }
      usersList.push(row);
    }, err => {
      if (err) { reject(err); }
      resolve(usersList);
    });
  })
}

exports.addUser = user => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(user.password, SALT_ROUNDS, (err, hash) => {
        if (err)
          reject(err);
        db.run(
          'INSERT INTO users (username, password, admin) ' +
          'VALUES ($user, $hash, $isAdmin)', {
            $user: user.name,
            $hash: hash,
            $isAdmin: user.isAdmin
          }, err => {
            if(err)
              reject(err);
          });
    });
  });
}

exports.login = (username, password) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username is ?', username,
    (err, row) => {
      if (err || !row)
        reject(err ? err : 'The username entered does not exist.');
      else {
        bcrypt.compare(password, row.password, (err, res) => {
          if (res) {
            row.password = '********';
            resolve(row);
          }
          else
            reject(err || new Error('Incorrect Password'));
        });
      }
    });
  });
}

exports.getUser = name => {
  return new Promise((resolve, reject) => {
    db.each('SELECT username, admin FROM users WHERE username is ? LIMIT 1',
    name, (err, row) => {
      if (err) { reject(err); }
      resolve(row);
    });
  });
}

exports.deleteUser = name => {
  db.run('DELETE FROM users WHERE rowid=?', name, function(err) {
    if (err)
      console.error(err);
    else
      console.log(this.changes);
  });
}

exports.close = () => {
  console.log('Closing users database');
  db.close((err) => {
    if (err)
      console.error(err);
  });
}

exports.initialized = () => {
  return initialized;
}
