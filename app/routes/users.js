"use strict"
const express = require('express');
const router = express.Router();
const users = require('../controllers/users.js');
const User = require('../models/user.js');

router.post('/users/add', (req, res) => {
  let { username, password } = req.body;
  users.addUser(new User(username, password));
});

router.post('/users/delete', (req, res) => {
  users.deleteUser(req.user);
});

/* TODO
router.post('/users/update', (req, res) => {
});
*/

router.get('/users', (req, res) => {
  // delay rendering the page until the database is initialized
  (function(timer) {
    if(users.initialized()) {
      users.all().then(result => {
        res.render('users', {
          title: 'IT Reporting - Users',
          heading: 'Users',
          users: result
        });
      }).catch(err => {
        res.status(503).send(err);
      });
    } else if(timer < 500) {
      setTimeout(this, 100, timer+100);
    // timeout after 500ms
    } else {
      console.error('Failed to load users database');
      res.status(503).send('ERROR 503: DATABASE NOT YET INITIALIZED');
    }
  })(0);
});

router.get('/users/add', (req, res) => {
  res.render('users_add', {
    title: 'Add User',
    heading: 'Add a new user'
  });
});

module.exports = router;
