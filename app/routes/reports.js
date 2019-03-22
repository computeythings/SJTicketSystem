"use strict"
const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports.js');
const comments = require('../controllers/comments.js');
const Report = require('../models/report.js');
const Comment = require('../models/comment.js');

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
    categories: ['workstation', 'printer/scanner', 'server', 'upgrade', 'software', 'purchasing', 'research']
  });
});

router.get('/reports/:reportId', (req, res) => {
  reports.getReport(req.params.reportId).then(async result => {
    res.render('report', {
      title: 'Ticket #' + result.rowid,
      ticket:  new Report(result),
      comments: await comments.forTicket(result.rowid),
      closeOptions: ['fixed', 'wontfix', 'duplicate']
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
    console.error(err);
    res.status(503).send(err);
  });
});

router.post('/reports/:reportId/update', (req, res) => {
  reports.updateReport(req.params.reportId, req.body).then(result => {
    res.status(201).redirect('/reports/' + req.params.reportId);
  }).catch(err => {
    console.error(err);
    res.status(503).send(err);
  });
});

router.post('/reports/:reportId/comment', (req, res) => {
  let comment = new Comment({
    ticketID: req.params.reportId,
    owner: req.user,
    comment: req.body.comment,
    type: req.body.type,
    date: Date.now()
  });

  comments.addComment(comment).then(result => {
    res.status(201).redirect('/reports/' + req.params.reportId);
  }).catch(err => {
    console.error(err);
    res.status(503).send(err);
  });
});


module.exports = router;
