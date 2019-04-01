"use strict"
const dateFormat = require('dateformat');

module.exports = class Ticket {
  constructor(ticket) {
    this.id = ticket.rowid;
    this.subject = ticket.subject;
    this.requestedBy = ticket.requestedBy;
    this.category = ticket.category;
    this.description = ticket.description;
    this.assignedTo = ticket.assignedTo;
    this.closed = ticket.closed;
    this.date = ticket.date;
    this.dateString = dateFormat(this.date, "mmm dd, yyyy");
    this.timeString = dateFormat(this.date, "h:MMtt");
  }
}
