function createMessageController({ messageService }) {
  async function receiveMessage(message) {
    try {
      const response = await messageService.receiveMessage(message);
      return response;
    } catch (error) {
      console.log(error);
      return { status: 'failed' };
    }
  }

  return { receiveMessage };
}

module.exports = createMessageController;
