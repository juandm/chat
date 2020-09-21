function createMessageService({ messageRepository, chatroomRepository }) {
  async function saveMessage(message) {
    try {
      const { selectedChatroom, userId, content } = message;
      const userChatroom = await chatroomRepository.getUserChatroomsByIds(
        userId,
        selectedChatroom.id,
      );
      const data = {
        content,
        chatroomUsersId: userChatroom.id,
      };
      const newMessage = await messageRepository.saveMessage(data);
      return { status: 'success', data: newMessage };
    } catch (error) {
      console.error(error);
      return { status: 'failed', message: 'Error creating message' };
    }
  }

  return { saveMessage };
}

module.exports = createMessageService;
