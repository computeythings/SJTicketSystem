"use strict"
const dateFormat = require('dateformat');

module.exports = class Report {
  constructor(report) {
    this.id = report.rowid;
    this.subject = report.subject;
    this.requestedBy = report.requestedBy;
    this.category = report.category;
    this.description = report.description;
    this.assignedTo = report.assignedTo;
    this.closed = report.closed;
    this.date = report.date;
    this.dateString = dateFormat(this.date, "mmm dd, yyyy");
    this.timeString = dateFormat(this.date, "h:MMtt");
    this.comments = report.comments ? JSON.parse(report.comments) : [];
  }

  addComment(comment) {
    this.comments.push(comment);
  }
}
