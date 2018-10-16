const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const routes = require('../api/routes/v1')
const error = require('../api/middlewares/error')

const app = express()

// secure apps by setting various HTTP headers
app.use(helmet())

// parse body params and attach them to req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// mount api v1 routes
app.use('/v1', routes)

// log errors
app.use(error.logErrors)

// error handler
app.use(error.handler)

module.exports = app
