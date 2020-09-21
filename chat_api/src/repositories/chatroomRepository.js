function createChatroomRepository({ db }) {
  async function getUserChatrooms(userId) {
    const chatrooms = await db('users as u')
      .innerJoin('chatrooms_users as cu', 'u.id', 'cu.userId')
      .innerJoin('chatrooms as c', 'cu.chatroom_id', 'c.id')
      .where('u.id', userId)
      .select(['c.id', 'c.name']);
    return chatrooms;
  }

  async function getUserChatroomsByIds(userId, chatroomId) {
    return db('users as u')
      .innerJoin('chatrooms_users as cu', 'u.id', 'cu.userId')
      .innerJoin('chatrooms as c', 'cu.chatroom_id', 'c.id')
      .where('u.id', userId)
      .where('c.id', chatroomId)
      .first(['cu.id', 'c.name', 'u.username']);
  }

  return { getUserChatrooms, getUserChatroomsByIds };
}

module.exports = createChatroomRepository;
