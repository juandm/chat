require('./environment').loadEnvironmentVars();
const { setupDatabase } = require('./database');
const messageBroker = require('./messageBroker');

const bootstrap = async () => {
  await setupDatabase();
  await messageBroker.setup();
};

module.exports = bootstrap;
