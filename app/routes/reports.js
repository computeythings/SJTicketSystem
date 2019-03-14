"use strict"
const dateFormat = require('dateformat');
const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports.js');

router.get('/reports', (req, res) => {
  reports.all().then(result => {
    res.render('reports', {
      title: 'Reports',
      heading: 'Reports',
      reports: result,
      reportDate: dateFormat(result.date, "h:MM tt mm-dd-yyyy")
    });
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.get('/reports/add', (req, res) => {
  res.render('reports_add', {
    title: 'Add Report',
    heading: 'Add a new report'
  });
});

router.post('/reports/add', (req, res) => {
  var report = req.body;
  report.date = Date.now();
  report.closed = 0;
  reports.addReport(report).then(result => {
    res.status(201).redirect('/reports');
  }).catch(err => {
    res.status(503).send(err);
  });
});

module.exports = router;
