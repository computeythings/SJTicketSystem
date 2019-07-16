"use strict"
const express = require('express');
const router = express.Router();
const tickets = require('../controllers/tickets.js');
const comments = require('../controllers/comments.js');
const Ticket = require('../models/ticket.js');
const Comment = require('../models/comment.js');

router.get('/', (req, res) => {
  var query;
  if(req.query.all === undefined)
    query = tickets.allOpen
  else
    query = tickets.all
  query().then(result => {
    res.render('tickets', {
      auth: req.session.user,
		  isAdmin: req.session.admin,
      admin: req.session.admin,
      title: 'Tickets',
      heading: 'Tickets',
      tickets: result
    });
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.get('/tickets/add', (req, res) => {
  res.render('tickets_add', {
    auth: req.session.user,
		isAdmin: req.session.admin,
    title: 'Add Ticket',
    heading: 'Add a new ticket',
    categories: ['workstation', 'printer/scanner', 'server', 'upgrade', 'software', 'hardware', 'purchasing', 'research', 'new user']
  });
});

router.get('/tickets/:ticketID', (req, res) => {
  tickets.getTicket(req.params.ticketID).then(async result => {
    res.render('ticket', {
      auth: req.session.user,
		  isAdmin: req.session.admin,
      title: 'Ticket #' + result.rowid,
      ticket:  new Ticket(result),
      comments: await comments.forTicket(result.rowid),
      closeOptions: ['fixed', 'wontfix', 'duplicate', 'workaround']
    });
  }).catch(err => {
    res.status(503).send(err);
  });
});

router.post('/tickets/add', (req, res) => {
  var ticket = req.body;
  ticket.date = Date.now();
  ticket.closed = 0;
  tickets.addTicket(new Ticket(ticket)).then(result => {
    res.status(201).redirect('/');
  }).catch(err => {
    console.error(err);
    res.status(503).send(err);
  });
});

router.post('/tickets/:ticketID/update', (req, res) => {
  tickets.updateTicket(req.params.ticketID, req.body).then(result => {
    res.status(201).redirect('/tickets/' + req.params.ticketID);
  }).catch(err => {
    console.error(err);
    res.status(503).send(err);
  });
});

router.post('/tickets/:ticketID/comment', (req, res) => {
  let comment = new Comment({
    ticketID: req.params.ticketID,
    owner: req.session.user,
    comment: req.body.comment,
    type: req.body.closeTicket === 'on' ? req.body.type : 'update',
    date: Date.now()
  });

  comments.addComment(comment).then(async result => {
    if(comment.type !== 'update') {
      await tickets.closeTicket(comment.ticketID);
    }
    res.status(201).redirect('/tickets/' + req.params.ticketID);
  }).catch(err => {
    console.error(err);
    res.status(503).send(err);
  });
});


module.exports = router;
