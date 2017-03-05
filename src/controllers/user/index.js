"use strict";

const passport = require('passport')

//private global properties
var repositories

function initUserController(app, repos){
	repositories = repos

	defineRouting(app)
}

function defineRouting(app){
	app.get('/user/profile', passport.authenticationMiddleware(), renderProfile)
	app.get('/user/all', passport.authenticationMiddleware(), renderAll)
}

function renderProfile(req, res){
	res.render('user/profile', {
		title: 'Profile',
		flashMessages: req.flash(),
		username: req.user.username
	})
}

function renderAll(){
	repositories.userRepository.findAllUsers().then(function(){
	    //success
	    logger.info("Found users : " +user+ " with success")
		req.flash('success', 'You have been registered')		
	}, function(error){
	    //error
	    logger.error("Registered user : " +user+ " with error : " + error)
	    req.flash('error', 'Service unavailable')
	}).fin(function(){
	    //finally (executed after error or success)
	    res.redirect('/auth/login')
	}).done()

	res.render('user/profile', {
		title: 'Profile',
		flashMessages: req.flash(),
		username: req.user.username
	})
}

module.exports = initUserController