const ResponseType = require('../utils/enums/responseTypeEnum');
const { onError, onSuccess } = require('../handlers/HTTPResponseHandler');

function createUserController({ validator, userService }) {
  async function createUser(req, res) {
    try {
      const userSchema = validator.getCreateUserSchema();
      const { isValid, data } = validator.validate(userSchema, req.body);
      if (!isValid) {
        return onError(res, ResponseType.BAD_REQUEST, data);
      }

      const { username, password } = data;
      const response = await userService.createUser(username, password);

      if (response.status === 'failed') {
        return onError(res, response.type, response.message);
      }

      return onSuccess(res, ResponseType.CREATED, response.data);
    } catch (error) {
      console.log(error);
      return onError(res, ResponseType.ERROR);
    }
  }

  return { createUser };
}

module.exports = createUserController;
