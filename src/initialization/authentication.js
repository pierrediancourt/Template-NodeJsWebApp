"use strict";

const passport = require('passport') //auth

function init(app){
	app.use(passport.initialize())
	app.use(passport.session()) //makes the auth use session, not cool for an api
}

module.exports = init