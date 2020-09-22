const ResponseType = require('../utils/enums/responseTypeEnum');
const { onError, onSuccess } = require('../handlers/HTTPResponseHandler');

function createChatroomController({ chatroomService }) {
  async function getMessages(req, res) {
    try {
      const { chatroomId } = req.params;
      const response = await chatroomService.getMessages(chatroomId);
      return onSuccess(res, ResponseType.SUCCESS, response.data);
    } catch (error) {
      console.log(error);
      return onError(res, ResponseType.ERROR);
    }
  }

  return { getMessages };
}

module.exports = createChatroomController;
