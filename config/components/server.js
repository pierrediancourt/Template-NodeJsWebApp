'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  PORT: joi.number()
  	.default(3553)
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)  
if (error) {  
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {  
  server: {
    port: envVars.PORT
  }
}

module.exports = config  