const Joi = require('joi');

const bookUpdateSchema = Joi.object({
  title: Joi.string().required(),
  originalTitle: Joi.string().required(),
  releaseDate: Joi.string().required(),
  description: Joi.string().required(),
  pages: Joi.number().integer().required(),
  cover: Joi.string().uri().required(),
  index: Joi.number().integer().required()
}).options({ stripUnknown: true });

function validateBookUpdateData(data) {
  return bookUpdateSchema.validate(data);
}

module.exports = { validateBookUpdateData };
