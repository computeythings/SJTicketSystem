"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const SALT_ROUNDS = 10;
const DATABASE = process.env.DATABASE || ':memory:';

var initialized = false;
const db = new sql.Database(DATABASE);
console.log('Opening users database at', DATABASE);
db.run('CREATE TABLE IF NOT EXISTS users ' +
  '(username TEXT, password TEXT, admin INTEGER, ' +
  'UNIQUE (username COLLATE NOCASE))', function(err) {
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
    db.each('SELECT username, admin FROM users', (err, row) => {
      if (err) { reject(err); }
      usersList.push(row);
    }, err => {
      if (err)
        reject(err);
      else
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
          }, function(err) {
            if(err)
              reject(err);
            else
              resolve(this.lastID);
          });
    });
  });
}

exports.login = (username, password) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username IS ? COLLATE NOCASE', username,
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

exports.changePassword = (username, passwordOld, passwordNew) => {
  return new Promise((resolve, reject) => {
    exports.login(username, passwordOld).then(success => {
      if(!success)
        return reject('Incorrect Password');
      bcrypt.hash(passwordNew, SALT_ROUNDS, (err, hash) => {
          if (err)
            return reject(err);
          db.run(
            'UPDATE users SET password = $hash WHERE username IS $user',
            {
              $user: username,
              $hash: hash
            }, function(err) {
              if(err)
                reject(err);
              else
                resolve('Password successfully updated.');
            });
      });
    }).catch(err => {
      reject(err);
    });
  });
}

exports.getUser = name => {
  return new Promise((resolve, reject) => {
    db.get('SELECT ROWID, username, admin FROM users WHERE username is ?',
    name, (err, row) => {
      if (err)
        reject(err);
      else
        resolve(row);
    });
  });
}

exports.deleteUser = id => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE rowid=?', id, function(err) {
      if (err)
        reject(err);
      else
        resolve(this.changes);
    });
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
