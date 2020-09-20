exports.up = (knex) => {
  const ChatroomUsers = knex.schema.createTable('chatrooms_users', (table) => {
    table.increments().primary();
    table.integer('chatroomId').references('id').inTable('chatrooms').notNullable();
    table.integer('userId').references('id').inTable('users').notNullable();
    table.timestamps('createdAt', true);
  });

  return ChatroomUsers;
};

exports.down = (knex) => {
  knex.schema.dropTable('chatrooms_users');
};
