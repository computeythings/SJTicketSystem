"use strict"
const express = require('express');
const router = express.Router();
const users = require('../controllers/users.js');
const User = require('../models/user.js');

router.post('/users/add', (req, res) => {
  let { username, password } = req.body;
  let user = new User(username, password, req.body.isAdmin === 'on');
  users.addUser(user).then(result => {
    res.status(201).redirect('/users');
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.post('/users/delete', (req, res) => {
  users.deleteUser(req.session.user);
});

router.get('/users/add', (req, res) => {
  res.render('users_add', {
    auth: req.session.user,
    title: 'Add User',
    heading: 'Add a new user'
  });
});

router.get('/users/:user', (req, res) => {
  users.getUser(req.params.user).then(result => {
    res.render('user', {
      auth: req.session.user,
      user: result
    });
  }).catch(err => {
    console.error(err);
    res.status(404).send('User not found');
  })
});

router.get('/users/:user', (req, res) => {
  users.getUser(req.params.user).then(result => {
    res.send(result);
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.get('/users', (req, res) => {
  // delay rendering the page until the database is initialized
  (function(timer) {
    if(users.initialized()) {
      users.all().then(result => {
        res.render('users', {
          auth: req.session.user,
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

module.exports = router;
