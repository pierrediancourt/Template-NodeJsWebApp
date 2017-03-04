"use strict";

const path = require('path')
const exphbs = require('express-handlebars') //templating

function init(app){

	//app.use(require('./helpers').setContext)
	var hbs = exphbs({
	  defaultLayout: 'layout',
	  extname: '.hbs',
	  helpers: require('./helpers').helpers,
	  layoutsDir: path.join(__dirname, "../../public/views/layouts"),
	  partialsDir: path.join(__dirname, "../../public/views/partials")
	})

	//configure handlebars files as default templating/render engine
	app.engine('.hbs', hbs)

	app.set('view engine', '.hbs')
	app.set('views', path.join(__dirname, "../../public/views"))
}

module.exports = init