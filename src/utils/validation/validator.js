const joi = require('joi');

function getCreateUserSchema() {
  return joi.object().keys({
    username: joi.string().required().min(4).max(80),
    password: joi.string().required().min(8).max(20),
  });
}

function mountValidationResponse(validationResult) {
  const { error, value } = validationResult;
  const response = { isValid: true, data: value };

  if (error) {
    response.isValid = false;
    response.data = error.details.reduce((acc, curr) => {
      const { context, message } = curr;
      acc[context.key] = message.replace(/"/g, '');
      return acc;
    }, {});
  }

  return response;
}

function validate(schema, data) {
  const options = { abortEarly: false };
  return mountValidationResponse(schema.validate(data, options));
}

module.exports = {
  validate,
  getCreateUserSchema,
};