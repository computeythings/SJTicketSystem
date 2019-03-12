"use strict"
const express = require('express');
const router = express.Router();
const db = require('../controllers/users.js');
var users;
new db().init().then(res => {
    users = res;
});

router.post('/users', (req, res) => {

});

router.get('/users', (req, res) => {
  awaitDatabase(0, () => {
    res.render('users', {
      title: 'Users Index',
      header: 'Users',
      users: users.all()
    });
  }, () => {
    res.status(503).send('ERROR 503: DATABASE NOT YET INITIALIZED');
  });
});

awaitDatabase(timer, callback, timeout) {
  if(!users) {
    if(timer >= 1000) {
      timeout();
    } else {
      timer+= 100;
      setTimeout(awaitDatabase(timer, callback, timeout), 100);
    }
  } else {
    callback();
  }
}

module.exports = router;
