"use strict";

const flash = require('express-flash')
const session = require('express-session')
const RedisStore = require('connect-redis')(session) //session storage
const logger = require('winston')

function init(app, config){
	
	logger.info("Using redis as session storage : " + config.redis.uri)
	
	app.use(session({	
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
		//maxAge: new Date(Date.now() + 3600),
		//ttl: //redis session ttl in sec. default to session.maxAge if set or one day
		secret: config.redis.secret,
		resave: false,
		saveUninitialized: false
	}))

	app.use(flash())
}

module.exports = init