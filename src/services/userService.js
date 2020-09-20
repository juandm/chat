const bcrypt = require('bcrypt');

function createUserService({ userRepository }) {
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
      return { status: 'success', data: createdUser };
    } catch (error) {
      console.error(error);
      return { status: 'failed', message: 'Error creating user' };
    }
  }

  return { createUser };
}

module.exports = createUserService;
