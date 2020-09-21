function createMessageRepository({ db }) {
  async function saveMessage(message) {
    const newMessage = await db('messages').insert(message).returning('*');
    return newMessage[0];
  }

  return { saveMessage };
}

module.exports = createMessageRepository;
