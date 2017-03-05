"use strict";

const path = require('path')
const http = require('http')
const express = require('express')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('../config')
const logger = require('winston')

const app = express()
logger.info(`Will start app in '${config.env}' mode on port '${config.server.port}'`, { pid: process.pid })

app.use(express.static(path.join(__dirname, "../public")))
app.use(cookieParser('secretSigningString'))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
//setting default route below
app.get('/', function (req, res) {
    res.redirect('/auth/login');
})

var server = http.createServer(app)

server.listen(config.server.port, function (err) {
	if (err) {
		throw err;
	}
	logger.info(`Listening on http://localhost:${config.server.port}`)
})

var mongoose = require('./initialization/database')(config)
require('./initialization/session')(app, config) 
require('./initialization/authentication')(app) //we need to init session before authentication because we use session for passport auth storage
require('./initialization/render')(app) //we need to init session before render because we use session for flash messages rendered to the user

var repositories = require('./repositories').init(mongoose)
require('./controllers').init(app, repositories)






