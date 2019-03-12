"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;
const DATABASE = process.env.USERS_DATABASE || ':memory:';

var initialized = false;
const db = new sql.Database(DATABASE);
db.run('CREATE TABLE IF NOT EXISTS users ' +
  '(user TEXT UNIQUE, password TEXT, admin INTEGER)', err => {
    if(!err)
      initialized = true;
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
          'INSERT INTO users (user, password, admin) ' +
          'VALUES ($user, $hash, 0)', {
            $user: user.name,
            $hash: user.password
          });
        resolve(true);
    });
  });
}

exports.login = user => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE user is ?', user.name,
    (err, row) => {
      if (err || !row)
        reject(err ? err : 'The username you have entered does not exist');
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

exports.getUser = name => {
  return new Promise((resolve, reject) => {
    db.each('SELECT user, admin FROM users WHERE user is ? LIMIT 1',
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
