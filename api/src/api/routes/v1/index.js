const express = require('express')
const router = express.Router()
const exampleRoute = require('./example.route')

/**
 * GET v1/status
 */
router.use('/status', (req, res) => res.send('OK'))

/**
 * POST v1/exampleRoute
 */
router.use('/exampleRoute', exampleRoute)

module.exports = router
