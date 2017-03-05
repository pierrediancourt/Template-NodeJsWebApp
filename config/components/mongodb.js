'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  MONGODB_URI: joi.string()
    .uri({ scheme: 'mongodb' })
    .required(),
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  mongodb: {
    uri: envVars.MONGODB_URI
  }
}

module.exports = config