import _ from 'lodash'
import Joi from 'joi'
import Schemas from './schemas'

function validator (body, schema, validationOptions, useJoiError, cb) {
  return Joi.validate(body, schema, validationOptions, (err, data) => {
    if (err) {
      // Joi Error
      const JoiError = {
        status: 'failed',
        error: {
          original: err._object,

          // fetch only message and type from each error
          details: _.map(err.details, ({message, type}) => ({
            message: message.replace(/['"]/g, ''),
            type
          }))
        }
      }

      // Custom Error
      const CustomError = {
        status: 'failed',
        error: 'Invalid request data. Please review request and try again.'
      }

      // Send back the JSON error response
      cb(useJoiError ? JoiError : CustomError)
    } else {
      cb(null, data)
    }
  })
}

export default (useJoiError = false) => {
  // useJoiError determines if we should respond with the base Joi error
  const _useJoiError = _.isBoolean(useJoiError)

  // enabled HTTP methods for request data validation
  const supportedMethods = ['get', 'post', 'put', 'delete']

  // Joi validation options
  const validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true // remove unknown keys from the validated data
  }

  // return the validation middleware
  return (req, res, next) => {
    const method = req.method.toLowerCase()
    const route = method + req.route.path

    if (_.includes(supportedMethods, method) && _.has(Schemas, route)) {
      // get schema for the current route
      const schema = _.get(Schemas, route)

      if (schema) {
        // Validate req.body using the schema and validation options
        const body = (method === 'get' || method === 'delete') ? { _id: req.params.id } : req.body
        return validator(body, schema, validationOptions, _useJoiError, (err, data) => {
          if (err) return res.status(422).json(err)
          // Replace req.body with the data after Joi validation
          req.body = data
          next()
        })
      }
    }
    next()
  }
}
