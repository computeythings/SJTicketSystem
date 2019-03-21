"use strict"
require('dotenv').config();
const sql = require('sqlite3');
const DATABASE = process.env.DATABASE || ':memory:';

var initialized = false;
const db = new sql.Database(DATABASE);

console.log('Opening comments database at', DATABASE);
db.run('CREATE TABLE IF NOT EXISTS comments ' +
'(ticketID INTEGER, owner TEXT, comment TEXT, type TEXT, date INTEGER)',
err => {
  if(!err)
    initialized = true;
});

exports.forTicket = ticketID => {
  return new Promise((resolve, reject) => {
    var commentList = [];
    db.each('SELECT ROWID, * FROM comments ' +
    'WHERE ticketID = ? ORDER BY date DESC', ticketID, (err, row) => {
      if (err) { reject(err); }
      commentList.push(row);
    }, err => {
      if (err)
        reject(err);
      else
        resolve(commentList);
    });
  })
}

exports.getComment = id => {
  return new Promise((resolve, reject) => {
    db.get('SELECT ROWID, * FROM comments WHERE rowid=?',
    id, (err, row) => {
      if (err)
        reject(err);
      else
        resolve(row);
    });
  });
}

exports.addComment = comment => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO reports (ticketID, owner, comment, type, date) ' +
      'VALUES ($ticketID, $owner, $comment, $type, $date)', {
        $ticketID: ticketID,
        $owner: owner,
        $comment: comment,
        $type: type,
        $date: date
      }, function(err) {
        if(err)
          reject(err);
        else
          resolve(this.lastID);
    });
  });
}

// Comments should only ever have their type or comment updated
exports.updateComment = (id, comment, type) => {
  return new Promise((resolve, reject) => {
    exports.getComment(id).then(result => {
      db.run(
        'UPDATE comments SET ' +
        'WHERE rowid=$id', {
          $id: id,
          $comment: comment,
          $type: type
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

exports.deleteComment = id => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM comments WHERE rowid=?', id, function(err) {
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
