const Joi = require('joi')

module.exports = {

  listThingIds: {
    body: {
      value: Joi.array().items(Joi.string()).required()
    }
  }

}
