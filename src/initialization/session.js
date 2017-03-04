"use strict";

const flash = require('express-flash')
const session = require('express-session')
const RedisStore = require('connect-redis')(session) //session storage
const logger = require('winston')

function init(app, config){
	
	logger.info("Using redis as session storage : " + config.redis.uri)
	
	app.use(session({
		maxAge: new Date(Date.now() + 3600000),
		//CHOICE 1 : configure MongoDB as session storage (using express-session + connect)
		/*store: new MongoStore({
		    url: config.urlMongo,
		    collection: 'sessions'
		}),*/
		//CHOICE 2 : configure redis as session storage (using express-session + connect-redis)
		store: new RedisStore({
			url: config.redis.uri
		}),
		//CHOICE 3 : configure default/classical session storage
		//cookie: { maxAge: 60000 },

		secret: config.redis.secret,
		resave: false,
		saveUninitialized: false
	}))

	app.use(flash())
}

module.exports = init