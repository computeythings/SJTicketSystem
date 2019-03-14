"use strict"

module.exports = class Report {
  constructor(report) {
    this.subject = report.subject;
    this.requestedBy = report.requestedBy;
    this.category = report.category;
    this.description = report.description;
    this.assignedTo = report.assignedTo;
    this.closed = report.closed;
    this.date = report.date;
  }
}
