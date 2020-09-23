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

  async function getByUserId(id) {
    return db('users').where('id', id).first('*');
  }

  return {
    createUser,
    getByUserName,
    getByUserId,
  };
}

module.exports = createUserRepository;
