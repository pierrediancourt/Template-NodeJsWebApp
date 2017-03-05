"use strict";

function initRepositories(mongoose){
	var userRepository = require('./user')(mongoose)

	return {
		userRepository : userRepository
	}
}

module.exports = initRepositories