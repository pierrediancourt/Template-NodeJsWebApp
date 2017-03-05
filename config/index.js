'use strict'

const common = require('./components/common')  
const logger = require('./components/logger')  
const server = require('./components/server')
const redis = require('./components/redis')
const mongodb = require('./components/mongodb')

module.exports = Object.assign({}, common, logger, server, redis, mongodb)  