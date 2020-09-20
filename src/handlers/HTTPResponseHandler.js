const HTTPStatus = require('http-status');
const ResponseType = require('../utils/enums/responseTypeEnum');

function responseTypeToHttpCode(responseType) {
  let code = null;

  switch (responseType) {
    case ResponseType.SUCCESS:
      code = HTTPStatus.OK;
      break;
    case ResponseType.CREATED:
      code = HTTPStatus.CREATED;
      break;
    case ResponseType.NOT_FOUND:
      code = HTTPStatus.NOT_FOUND;
      break;
    case ResponseType.BAD_REQUEST:
      code = HTTPStatus.BAD_REQUEST;
      break;
    case ResponseType.ERROR:
      code = HTTPStatus.INTERNAL_SERVER_ERROR;
      break;
    case ResponseType.UNAUTHORIZED:
      code = HTTPStatus.UNAUTHORIZED;
      break;
    default:
      code = HTTPStatus.INTERNAL_SERVER_ERROR;
      break;
  }
  return code;
}

function onSuccess(res, responseType, data) {
  const response = {
    status: 'success',
    data: {},
  };

  const code = responseTypeToHttpCode(responseType);
  if (code === HTTPStatus.OK || code === HTTPStatus.CREATED) {
    response.data = data;
    return res.status(code).json(response);
  }
  return res.status(HTTPStatus.OK).send();
}

function onError(res, errorType, data) {
  const response = { status: 'error' };
  const code = responseTypeToHttpCode(errorType);
  const isBadRequestError = code && code.toString().startsWith('4');

  if (isBadRequestError) {
    response.status = 'fail';
    response.data = typeof data === 'string' ? { message: data } : data;
  } else {
    response.message = data || 'Something went wrong';
  }

  return res.status(code || HTTPStatus.INTERNAL_SERVER_ERROR).json(response);
}

module.exports = {
  onError,
  onSuccess,
};
