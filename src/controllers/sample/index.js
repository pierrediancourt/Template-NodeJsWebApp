"use strict";

const passport = require('passport')
const logger = require('winston')

//private global properties
var repositories

function initSampleController(app, repos){
	repositories = repos

	defineRouting(app)
}

function defineRouting(app){
	app.get('/sample/menu', passport.authenticationMiddleware(), renderMenu) //displays the menu

	app.get('/sample/demo', passport.authenticationMiddleware(), renderDemo)

	app.get('/sample/all', passport.authenticationMiddleware(), renderAll) //displays a list of all the users in base

	app.get('/sample/get/delete/:username', passport.authenticationMiddleware(), renderDelete) //deletes user in param
	app.get('/sample/get/delete', passport.authenticationMiddleware(), renderDelete) //deletes currently logged user

	app.get('/sample/get/update/:username/:language', passport.authenticationMiddleware(), renderUpdate) //updates user matching username in param with language in param
	app.get('/sample/get/update/:language', passport.authenticationMiddleware(), renderUpdate) //updates currently logged user with language in param

	app.get('/sample/post/update', passport.authenticationMiddleware(), renderUpdatePost) //displays the form for the next line
	app.post('/sample/post/update', passport.authenticationMiddleware(), postUpdate) //updates currently logged user with language in form

	app.get('/sample/get/updateAll/:language/:newLanguage', passport.authenticationMiddleware(), renderUpdateAll) //updates all users in base matching language in param with newLanguage in param

	app.get('/sample/post/updateAll', passport.authenticationMiddleware(), renderUpdateAllPost) //displays the form for next line
	app.post('/sample/post/updateAll', passport.authenticationMiddleware(), postUpdateAll) //updates all users in database matching language in form with newLanguage in form
}

function renderMenu(req, res){
	res.render('sample/menu', {
		title: 'Menu',
		flashMessages: req.flash()
	})
}

function renderDemo(req, res){
	res.render('sample/demo', {
		title: 'Demo',
		flashMessages: req.flash()
	})
}

function renderAll(req, res){
	var usersFromDb
	repositories.userRepository.findAllUsers().then(function(users){
	    //success
	    logger.info("Found users : " +users+ " with success")
	    usersFromDb = users	    
	}, function(error){
	    //error
	    logger.error("Didnt find users : " + error)
	    req.flash('error', 'Service unavailable')
	}).fin(function(){
	    //finally (executed after error or success)
	    res.render('sample/all', {
			title: 'All',
			flashMessages: req.flash(),
			users: usersFromDb
		})
	}).done()
}

function renderDelete(req, res){
	var username 
	if(req.params.username){
		username = req.params.username
	}
	else{
		username = req.session.passport.user //session is necessarly filled because we passed in a routing rule containing passport.authenticationMiddleware() so the user is connected
	}

	var where = { username : username }
	repositories.userRepository.deleteUser(where).then(function(result){
	    //success
	    logger.info("Deleted user : " +user+ " with success")
	    req.flash('success', "This is the raw result obtained from the database : " +result)
	}, function(error){
	    //error
	    logger.error("Failed deleting user : " +user+ " with error " + error)
	    req.flash('error', 'Service unavailable')
	}).fin(function(){
	    //finally (executed after error or success)
	    res.redirect('/sample/menu')
	}).done()
}

//GET UPDATE
function renderUpdate(req, res){
	if(!req.params.language){
		req.flash('error', 'Please pass language as url parameters, and optionally a username')
		res.redirect('/sample/menu')
	}
	
	var username
	if(req.params.username){
		username = req.params.username
	}
	else{
		username = req.session.passport.user //session is necessarly filled because we passed in a routing rule containing passport.authenticationMiddleware() so the user is connected
	}
	
	var where = { username : username }
	var set = { language : req.params.language }
	repositories.userRepository.updateUser(where, set).then(function(result){
	    //success
	    logger.info("Update user where : " +where+ " with new data : " +set+ " with success")
	    req.flash('success', "This is the raw result obtained from the database : " +result)
	}, function(error){
	    //error
	    logger.error("Failed updating user where : " +where+ " with new data : " +set+ " with error " + error)
	    req.flash('error', 'Service unavailable')
	}).fin(function(){
	    //finally (executed after error or success)
	    res.redirect('/sample/menu')
	}).done()
}

//POST UPDATE
function renderUpdatePost(req, res){
	res.render('sample/post/update', {
		title: 'Update',
		flashMessages: req.flash()
	})
}

function postUpdate(req, res){
	if(!req.body.language){
		req.flash('error', 'Please fill all the forms')
		res.redirect('/sample/post/update')
	}

	var where = { username : req.session.passport.user } //session is necessarly filled because we passed in a routing rule containing passport.authenticationMiddleware() so the user is connected
	var set = { language : req.body.language }
	repositories.userRepository.updateUser(where, set).then(function(result){
	    //success
	    logger.info("Update user where : " +where+ " with new data : " +set+ " with success")
	    req.flash('success', "This is the raw result obtained from the database : " +result)
	}, function(error){
	    //error
	    logger.error("Failed updating user where : " +where+ " with new data : " +set+ " with error " + error)
	    req.flash('error', 'Service unavailable')
	}).fin(function(){
	    //finally (executed after error or success)
	    res.redirect('/sample/menu')
	}).done()
}

//GET UPDATE ALL
function renderUpdateAll(req, res){
	if(!req.params.language
	|| !req.params.newLanguage){
		req.flash('error', 'Please pass language and newLanguage as url parameters')
		res.redirect('/sample/menu')
	}

	var where = { language : req.params.language }
	var set = { language : req.params.newLanguage }
	repositories.userRepository.updateUsers(where, set).then(function(result){
	    //success
	    logger.info("Update users where : " +where+ " with new data : " +set+ " with success")
	    req.flash('success', "This is the raw result obtained from the database : " +result)
	}, function(error){ 
	    //error
	    logger.error("Failed updating user where : " +where+ " with new data : " +set+ " with error " + error)
	    req.flash('error', 'Service unavailable')
	}).fin(function(){
	    //finally (executed after error or success)
	    res.redirect('/sample/menu')
	}).done()
}

//POST UPDATE ALL
function renderUpdateAllPost(req, res){
	res.render('sample/post/updateAll', {
		title: 'UpdateAll',
		flashMessages: req.flash()
	})
}

function postUpdateAll(req, res){
	if(!req.body.language
	|| !req.body.newLanguage){
		req.flash('error', 'Please fill all the forms')
		res.redirect('/sample/post/updateAll')
	}

	var where = { language : req.body.language }
	var set = { language : req.body.newLanguage }
	repositories.userRepository.updateUsers(where, set).then(function(result){
	    //success
	    logger.info("Update users where : " +where+ " with new data : " +set+ " with success")
	    req.flash('success', "This is the raw result obtained from the database : " +result)
	}, function(error){ 
	    //error
	    logger.error("Failed updating user where : " +where+ " with new data : " +set+ " with error " + error)
	    req.flash('error', 'Service unavailable')
	}).fin(function(){
	    //finally (executed after error or success)
	    res.redirect('/sample/menu')
	}).done()
}

module.exports = initSampleController