"use strict"

module.exports = class Report {
  constructor(title, requestedBy, category, description, date) {
    this.title = title;
    this.requestedBy = requestedBy;
    this.category = category;
    this.description = description;
    this.date = date;
  }
}
