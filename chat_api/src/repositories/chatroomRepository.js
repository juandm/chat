function createChatroomRepository({ db }) {
  async function getUserChatrooms(userId) {
    const chatrooms = await db('users as u')
      .innerJoin('chatrooms_users as cu', 'u.id', 'cu.userId')
      .innerJoin('chatrooms as c', 'cu.chatroom_id', 'c.id')
      .where('u.id', userId)
      .select(['c.id', 'c.name']);
    return chatrooms;
  }

  return { getUserChatrooms };
}

module.exports = createChatroomRepository;
