"use strict";

const passport = require('passport')
const logger = require('winston')

//private global properties
var repositories

function initUserController(app, repos){
	repositories = repos

	defineRouting(app)
}

function defineRouting(app){
	app.get('/user/profile', passport.authenticationMiddleware(), renderProfile)
}

function renderProfile(req, res){
	res.render('user/profile', {
		title: 'Profile',
		flashMessages: req.flash(),
		username: req.user.username
	})
}

module.exports = initUserController