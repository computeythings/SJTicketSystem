"use strict"
const express = require('express');
const router = express.Router();
const users = require('../controllers/users.js');

router.get('users', (req, res) => {
  // delay rendering the page until the database is initialized
  if(users.initialized()) {
    return users.all().then(result => {
        res.json(result);
      }).catch(err => {
        res.status(503).send(err);
      });
  }
  return res.status(501).send(new Error('Server not yet initialized'));
});


module.exports = router;
