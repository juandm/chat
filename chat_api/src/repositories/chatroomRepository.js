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

  async function getMessages(chatroomId) {
    return db('chatrooms as c')
      .innerJoin('chatrooms_users as cu', 'c.id', 'cu.chatroomId')
      .innerJoin('users as u', 'u.id', 'cu.userId')
      .innerJoin('messages as m', 'cu.id', 'm.chatroomUsersId')
      .where('c.id', chatroomId)
      .select([
        'm.id as messageId',
        'm.content',
        'm.createdAt',
        'c.name as chatroomName',
        'c.id as chatroomId',
        'u.username',
        'u.id as userId',
      ])
      .orderBy('m.createdAt', 'desc')
      .limit(50);
  }

  return { getUserChatrooms, getUserChatroomsByIds, getMessages };
}

module.exports = createChatroomRepository;
