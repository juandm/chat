require('./environment').loadEnvironmentVars();
const { setupDatabase } = require('./database');
const messageBroker = require('./messageBroker');
const dependencyResolver = require('./dependencyContainer');

const bootstrap = async () => {
  const authStrategies = dependencyResolver.resolve('authStrategies');
  const strategies = authStrategies.loadAuthStrategies();
  await setupDatabase();
  await messageBroker.setup();
  return { authStrategies: strategies };
};

module.exports = bootstrap;
