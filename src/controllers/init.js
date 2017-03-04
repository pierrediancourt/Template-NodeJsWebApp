"use strict";

function initControllers(app){
  require('./auth')(app) //has to be before the other ones relying on the auth
  require('./user')(app)
  require('./note')(app)
  require('./lobby')(app)
}

module.exports = initControllers