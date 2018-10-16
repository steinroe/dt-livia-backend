const httpStatus = require('http-status')

/**
 * Log errors.
 * @public
 */
const logErrors = (err, req, res, next) => {
  console.error(err.stack || err)
  next(err)
}
exports.logErrors = logErrors

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack
  }

  if (process.env.NODE_ENV !== 'development') {
    delete response.stack
  }

  res.status(err.status)
  res.json(response)
  res.end()
}
exports.handler = handler
