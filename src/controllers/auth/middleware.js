"use strict";

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next() //goes to the next middleware if the user is authenticated
    }
    res.redirect('/') //goes to the page where the user can log in because the user isn't authenticated
  }
}

module.exports = authenticationMiddleware