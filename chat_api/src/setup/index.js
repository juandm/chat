require('./environment').loadEnvironmentVars();
const { setupDatabase } = require('./database');

const bootstrap = async () => {
  await setupDatabase();
};

module.exports = bootstrap;
