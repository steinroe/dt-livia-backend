const express = require('express')
const validate = require('express-validation')
const controller = require('../../controllers/example.controller')
const validator = require('../../validations/example.validation')

const router = express.Router()

router
  .route('/')
  .post(validate(validator.listThingIds), controller.post)

module.exports = router
