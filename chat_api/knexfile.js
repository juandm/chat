module.exports = {
  client: 'postgresql',
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/config/database/migrations',
  },
  seeds: { directory: './src/config/database/seeds' },
};
