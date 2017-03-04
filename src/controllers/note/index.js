"use strict";

const passport = require('passport')

function initNoteController(app){
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