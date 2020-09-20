function createUserRepository({ db }) {
  async function createUser(username, password) {
    const users = await db('users')
      .insert({ username, password })
      .returning(['id', 'username', 'createdAt']);
    return users[0];
  }

  async function getByUserName(username) {
    return db('users').where('username', username).first('*');
  }

  return {
    createUser,
    getByUserName,
  };
}

module.exports = createUserRepository;
