"use strict";

//global.Promise = require('q')
const Q = require('q')
const logger = require('winston')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const authenticationMiddleware = require('./middleware')

//private global properties
var repositories

//called when setting username to session to authenticate the user
passport.serializeUser(function (user, done) {
	done(null, user.username)
})

//called when checking username in session to verify the user authentication
passport.deserializeUser(function (username, done) {
	repositories.userRepository.findUser(username).nodeify(done)
})

function initAuthController(app, repos) {
	repositories = repos
    passport.use(new LocalStrategy(
	    function(username, password, done) {
	    	var userFromDb
	    	repositories.userRepository.findUser(username)
		    .then(function(user) {
		        if (!user) {
		        	logger.info("User tried to log in with wrong username")
		        	throw "Incorrect username or password" //failed authentication because we didn't find the user in database 
		        }
		        userFromDb = user
		        return bcrypt.compare(password, user.password)
		    })
		    .then(function(arePasswordsMatching) {
				if (arePasswordsMatching) {
					return userFromDb;
				}
				else {
					logger.info("User tried to log in with wrong password")
					throw "Incorrect username or password" //failed authentication, password is wrong
				}
		    })
		    .nodeify(done)
	    }
    ))

	passport.authenticationMiddleware = authenticationMiddleware

	defineRouting(app)
}

function defineRouting (app) {
	app.get('/auth/login', renderLogin)
	app.post('/auth/login', postLogin)

	app.get('/auth/logout', function(req, res){
		logger.info("User logged out : " +req.session.passport.user)
		req.logout()		
		req.flash('success', 'You have been successfully logged out')
		res.redirect('/auth/login')
	})

	app.get('/auth/register', renderRegister)
	app.post('/auth/register', postRegister)
}

function renderLogin (req, res) {  
  res.render('auth/login', {
    title: 'Login',
    flashMessages: req.flash()
  })
}

function postLogin (req, res, next){
	passport.authenticate('local', function(error, user, info) {
		logger.verbose("Authentication infos : " +info)
		//if error is set user is null 
	    if (error && !user) {
	    	req.flash('error', error) 
	    	return res.redirect('/auth/login')
	    }

	    req.login(user, error => {
	    	if (error) {
	    	  	logger.error("Log in error : " +error)
	    	  	return next(error) // will generate a 500 error ?
	    	}
	    	logger.info("User logged in : " +user)
	    	req.flash('success', 'You have been successfully logged in')
	    	return res.redirect('/user/profile')
    	})
	})(req, res, next)
}

function renderRegister (req, res) {
	res.render('auth/register', {
		title: 'Register',
		flashMessages: req.flash()
	})
}

function postRegister (req, res) {
	if(!req.body.username
	|| !req.body.password
	|| !req.body.passwordConfirm){
		req.flash('error', 'Please fill all the forms')
		res.redirect('/auth/register')
	}

	if(req.body.password != req.body.passwordConfirm){
		req.flash('error', 'Password fields must match')
		res.redirect('/auth/register')
	}

	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.password, salt, function(err, hash) {
			var user = { "username" : req.body.username, "password" : hash, "language" : "fr" }
			repositories.userRepository.insertUser(user).then(function(){
			    //success
			    logger.info("Registered user : " +user+ " with success")
				req.flash('success', 'You have been registered')		
			}, function(error){
			    //error
			    logger.error("Registered user : " +user+ " with error : " + error)
			    req.flash('error', 'Service unavailable')
			}).fin(function(){
			    //finally (executed after error or success)
			    res.redirect('/auth/login')
			}).done()
		})
	})
}

module.exports = initAuthController
