const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function createUserService({ userRepository, chatroomRepository }) {
  async function createUser(username, password) {
    try {
      const response = { status: 'failed', message: '' };

      const user = await userRepository.getByUserName(username);
      if (user) {
        response.message = 'An user with that username already exists';
        return response;
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const createdUser = await userRepository.createUser(username, passwordHash);

      // join default rooms
      const rooms = await chatroomRepository.getAll();
      await Promise.all(
        rooms.map((room) => chatroomRepository.addUser(room.id, createdUser.id)),
      );

      return { status: 'success', data: createdUser };
    } catch (error) {
      console.error(error);
      return { status: 'failed', message: 'Error creating user' };
    }
  }

  async function validateUser(username, password) {
    const response = { isValid: false };
    const user = await userRepository.getByUserName(username);
    if (!user) return response;

    const isValidPassword = await bcrypt.compare(password, user.password);
    user.isValid = isValidPassword;
    return user;
  }

  async function login(userName, password) {
    const user = await validateUser(userName, password);
    let token = null;
    if (user.isValid) {
      const jwtOpts = {
        issuer: 'chat-api',
        subject: user.id.toString(),
      };
      token = jwt.sign({}, process.env.JWT_SECRET, jwtOpts);
    }
    return token;
  }

  async function getUserChatrooms(userId) {
    const chatrooms = await chatroomRepository.getUserChatrooms(userId);
    return chatrooms;
  }

  async function joinChatroom(chatroomId, userId) {
    try {
      const messages = await chatroomRepository.getMessages(chatroomId);
      return { status: 'success', data: messages };
    } catch (error) {
      console.error(error);
      return { status: 'failed', message: 'Error listing messages' };
    }
  }
  return { createUser, login, getUserChatrooms };
}

module.exports = createUserService;
