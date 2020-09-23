exports.seed = function (knex) {
  // Deletes ALL existing entries
  // prettier-ignore
  return knex('chatrooms')
    .del()
    .then(() => { // eslint-disable-line
      // Inserts seed entries
      return knex('chatrooms').insert([
        { id: 1, name: 'Work' },
        { id: 2, name: 'Friends' },
        { id: 3, name: 'General' },
      ]);
    });
};
