'use strict'

const common = require('./components/common')  
const logger = require('./components/logger')  
const server = require('./components/server')
const redis = require('./components/redis')

module.exports = Object.assign({}, common, logger, server, redis)  