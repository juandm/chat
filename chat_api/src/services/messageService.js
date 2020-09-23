const sendMessageEmitter = require('../utils/sendMessageEmitter');

function createMessageService({ messageRepository, chatroomRepository }) {
  async function saveMessage(message) {
    try {
      const { selectedChatroom, userId, content, username } = message;
      const userChatroom = await chatroomRepository.getUserChatroomsByIds(
        userId,
        selectedChatroom.id,
      );
      const data = {
        content,
        chatroomUsersId: userChatroom.id,
      };
      const newMessage = await messageRepository.saveMessage(data);
      newMessage.userId = userId;
      newMessage.chatRoomId = selectedChatroom.id;
      newMessage.username = username;
      return { status: 'success', data: newMessage };
    } catch (error) {
      console.error(error);
      return { status: 'failed', message: 'Error creating message' };
    }
  }

  async function receiveMessage(message) {
    try {
      const { content } = message;
      let newMessage = null;

      const isBotMessage = /^(\/stock=)\w{2,5}\.\w{2,5}$/.test(content.trim());
      console.log(isBotMessage);

      if (isBotMessage) {
        sendMessageEmitter.emit('request_bot_message', message);
      } else {
        newMessage = (await saveMessage(message)).data;
        newMessage.isBotMessage = false;
      }

      return { status: 'success', data: newMessage };
    } catch (error) {
      console.error(error);
      return { status: 'failed', message: 'Error creating message' };
    }
  }

  return { receiveMessage };
}

module.exports = createMessageService;
