"use strict"
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if(req.cookies && req.cookies.jwt) {
    res.render('index', {
      title: 'IT Reporting'
    });
  } else {
    res.redirect(301, '/login');
  }
});

module.exports = router;
