"use strict";

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const authenticationMiddleware = require('./middleware')

const user = { //fake user object normally coming from database
  username: 'user',
  password: 'password',
  id: 1
}

function findUser (username, callback) { //should lookup in a database to find the user object
  if (username === user.username) {
    return callback(null, user)
  }
  return callback(null)
}

passport.serializeUser(function (user, cb) {
  cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
})

function initAuthController(app) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      findUser(username, function (err, user) {
        if (err) {
          return done(err) //failed authentication because the user lookup in database failed
        }
        if (!user) {
          console.log("user not found")
          return done(null, false, { message: 'Incorrect username or password'}) //failed authentication because we didn't find the user in database 
        }
        if (password !== user.password  ) {
          console.log("wrong password")
          return done(null, false, { message: 'Incorrect username or password'}) //failed authentication, password is wrong
        }
        return done(null, user) //returning the user to passport, notifying it that we finished our checks and that the user is successfully authenticated
      })
    }
  ))

  passport.authenticationMiddleware = authenticationMiddleware

  defineRouting(app)
}

function defineRouting (app) {
  app.get('/auth/login', renderLogin)
  app.post('/auth/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/auth/login',
    failureFlash: true 
  }))

  app.get('/auth/logout', function(req, res){
    req.logout();
    req.flash('success', 'You have been successfully logged out.')
    res.redirect('/auth/login');
  });
}

function renderLogin (req, res) {  
  res.render('auth/login', {
    title: 'Login',
    flashMessages: req.flash()
  })
}

module.exports = initAuthController