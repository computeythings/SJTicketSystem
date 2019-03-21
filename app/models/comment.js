"use strict"
const dateFormat = require('dateformat');

module.exports = class Report {
  constructor(comment) {
    this.ticketID = comment.ticketID;
    this.owner = comment.owner;
    this.comment = comment.comment;
    this.type = comment.type;
    this.date = comment.date;
    this.dateString = dateFormat(this.date, "mmm dd, yyyy");
    this.timeString = dateFormat(this.date, "h:MMtt");
  }
}
