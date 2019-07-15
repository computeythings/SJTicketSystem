"use strict"

module.exports = class User {
  constructor(name, password, isAdmin) {
    this.name = name;
    this.password = password;
    this.isAdmin = isAdmin ? 1 : 0;
  }
}
