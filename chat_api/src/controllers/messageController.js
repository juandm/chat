function createMessageController({ messageService }) {
  async function saveMessage(message) {
    try {
      const response = await messageService.saveMessage(message);
      return response;
    } catch (error) {
      console.log(error);
      return { status: 'failed' };
    }
  }

  return { saveMessage };
}

module.exports = createMessageController;
