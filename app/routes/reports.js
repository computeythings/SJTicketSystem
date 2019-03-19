"use strict"
const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports.js');
const Report = require('../models/report.js');

router.get('/reports', (req, res) => {
  reports.all().then(result => {
    res.render('reports', {
      title: 'Tickets',
      heading: 'Tickets',
      reports: result
    });
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.get('/reports/add', (req, res) => {
  res.render('reports_add', {
    title: 'Add Ticket',
    heading: 'Add a new ticket',
    categories: ['workstation', 'printer', 'server', 'upgrade', 'software', 'purchasing', 'research']
  });
});

router.get('/reports/:reportId', (req, res) => {
  reports.getReport(req.params.reportId).then(result => {
    res.render('report', {
      title: 'Ticket #' + result.rowid ,
      ticket: result
    });
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.post('/reports/add', (req, res) => {
  var report = req.body;
  report.date = Date.now();
  report.closed = 0;
  reports.addReport(new Report(report)).then(result => {
    res.status(201).redirect('/reports');
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.get('/reports/edit/:reportId', (req, res) => {
  reports.getReport(req.params.reportId).then(result => {
    res.send(result);
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.post('/reports/edit/:reportId', (req, res) => {

});


module.exports = router;
