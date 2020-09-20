exports.up = (knex) => {
  const createChatRoom = knex.schema.createTable('chatrooms', (table) => {
    table.increments().primary();
    table.string('name', 80).notNullable();
    table.timestamps('createdAt', true);
  });

  return createChatRoom;
};

exports.down = (knex) => {
  knex.schema.dropTable('chatrooms');
};
