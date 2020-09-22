function createChatroomService({ chatroomRepository }) {
  async function getMessages(chatroomId) {
    try {
      const messages = await chatroomRepository.getMessages(chatroomId);
      return { status: 'success', data: messages };
    } catch (error) {
      console.error(error);
      return { status: 'failed', message: 'Error listing messages' };
    }
  }

  return { getMessages };
}

module.exports = createChatroomService;
