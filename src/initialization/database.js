"use strict";

const mongoose = require('mongoose')

function init(config){
	mongoose.Promise = require('q').Promise;
	mongoose.connect(config.mongodb.uri);
	return mongoose
}

module.exports = init;