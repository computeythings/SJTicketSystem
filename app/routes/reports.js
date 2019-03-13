"use strict"
const express = require('express');
const router = express.Router();
const reports = require('../controllers/reports.js');

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
