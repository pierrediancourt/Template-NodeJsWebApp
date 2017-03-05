"use strict";

function initControllers(app, repositories){
	require('./auth')(app, repositories) //has to be before the other ones relying on the auth
	require('./user')(app, repositories)
    require('./sample')(app, repositories)
}

module.exports = initControllers