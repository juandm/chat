const knex = require('knex');
const knexStringcase = require('knex-stringcase');
const { types } = require('pg');

const config = require('../../knexfile');

const INT8_OID = 20; // int8 postgres type OID
const NUMERIC_OID = 1700;

config.connection = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

config.debug = true;

const connection = knex(knexStringcase(config));

async function setTypeParsers() {
  types.setTypeParser(INT8_OID, (val) => parseInt(val, 10));
  types.setTypeParser(NUMERIC_OID, (val) => parseFloat(val));
}

async function runMigrations() {
  return connection.migrate.latest();
}

async function setupDatabase() {
  await setTypeParsers();
  await runMigrations();
}

module.exports = { connection, setupDatabase };
