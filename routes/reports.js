"use strict"
const express = require('express');
const router = express.Router();
const db = require('../controllers/reports.js');
const reports = new db().init();

router.post('/reports', (req, res) => {

});
router.get('/reports', (req, res) => {
  res.render('reports', {
    title: 'Reports',
    header: 'Reports',
    reports: reports.all()
  });
});

module.exports = router;
