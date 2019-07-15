"use strict"
const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users.js');
const User = require('../models/user.js');

router.post('/users/add', (req, res) => {
  let { username, password } = req.body;
  let user = new User(username, password, req.body.isAdmin === 'on');
  users.addUser(user).then(result => {
    res.status(201).redirect('/users');
  }).catch(err => {
    res.status(503).json(err);
  });
});

router.post('/users/:userID/delete', async (req, res) => {
  // prevent deletion of currently logged in user
  let current = await users.getUser(req.session.user);
  if(current.rowid == req.params.userID)
    return res.status(503).send('You cannot delete your own user!');

  users.deleteUser(req.params.userID).then(result => {
    res.status(301).redirect('/users');
  }).catch(err => {
    console.log('Failed to delete user', err);
    res.status(503).redirect(req.url);
  });
});

router.post('/users/:userID/update', async (req, res) => {
  users.updateUser(req.params.userID, parsePOST(req.body)).then(result => {
    res.status(301);
  }).catch(err => {
    console.log('Failed to update user', err);
    res.status(503);
  });
  res.redirect('/users');
});

router.post('/account/update', (req, res) => {
  users.changePassword(req.session.user, req.body.current, req.body.password)
  .then(success => {
    if(success)
      res.status(200).send(success);
    else
      res.status(503).send('Unexpected Failure')
  }).catch(err => {
    console.log(err)
    res.status(401).send('Incorrect Password');
  });
});

router.get('/users/add', (req, res) => {
  res.render('users_add', {
    auth: req.session.user,
		isAdmin: req.session.admin,
    title: 'Add User',
    heading: 'Add a new user'
  });
});

router.get('/users/:userID', (req, res) => {
  users.getUser(req.params.userID).then(user => {
    res.render('user', {
      title: 'User Management',
      auth: req.session.user,
      isAdmin: req.session.admin,
      user: user
    });
  });
});

router.get('/account', (req, res) => {
  res.render('account', {
    title: 'My Account',
    auth: req.session.user,
		isAdmin: req.session.admin,
    user: req.session.user
  });
});

router.get('/users', (req, res) => {
  // delay rendering the page until the database is initialized
  (function(timer) {
    if(users.initialized()) {
      users.all().then(result => {
        res.render('users', {
          auth: req.session.user,
		      isAdmin: req.session.admin,
          title: 'IT Ticketing - Users',
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

function parsePOST(json) {
  switch(json.admin) {
    case 'on':
      json.admin = 1;
      break;
    default:
      json.admin = 0;
      break;
  }
  return json;
}

module.exports = router;
