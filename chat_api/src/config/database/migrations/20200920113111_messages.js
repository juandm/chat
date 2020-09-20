exports.up = (knex) => {
  const createMessages = knex.schema.createTable('messages', (table) => {
    table.increments().primary();
    table.text('content').notNullable();
    table
      .integer('chatroomUsersId')
      .references('id')
      .inTable('chatrooms_users')
      .notNullable();
    table.timestamps('createdAt', true);
  });

  return createMessages;
};

exports.down = (knex) => {
  knex.schema.dropTable('messages');
};
