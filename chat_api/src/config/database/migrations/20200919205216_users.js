exports.up = (knex) => {
  const createUsers = knex.schema.createTable('users', (table) => {
    table.increments().primary();
    table.string('username', 80).unique().notNullable();
    table.text('password').notNullable();
    table.timestamps('createdAt', true);
  });

  return createUsers;
};

exports.down = (knex) => {
  knex.schema.dropTable('users');
};
