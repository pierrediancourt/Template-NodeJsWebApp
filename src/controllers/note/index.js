"use strict";

const passport = require('passport')

//private global properties
var repositories

function initNoteController(app, repos){
	repositories = repos

	defineRouting(app)
}

function defineRouting (app) { 
	app.get('/note/:id', passport.authenticationMiddleware(), renderNote)
}

function renderNote (req, res) {
	res.render('note/overview', {
		title: 'Note',
		flashMessages: req.flash(),
		id: req.params.id
	})
}

module.exports = initNoteController