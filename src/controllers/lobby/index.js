"use strict";

const passport = require('passport')

function initLobbyController(app){
	defineRouting(app)
}

function defineRouting(app){
	app.get('/lobby/chat', passport.authenticationMiddleware(), renderChat)
}

function renderChat (req, res) {
	res.render('lobby/chat', {
		title: 'Profile',
		flashMessages: req.flash(),
		username: req.user.username
	})
}

module.exports = initLobbyController