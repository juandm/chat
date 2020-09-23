const awilix = require('awilix');

const authStrategies = require('./authStrategies');
const validator = require('../utils/validation/validator');
const { connection: db } = require('./database');

const injectionMode = awilix.InjectionMode.PROXY;
const container = awilix.createContainer({ injectionMode });

container.loadModules(
  ['../controllers/**/*.js', '../services/**/*.js', '../repositories/**/*.js'],
  {
    cwd: __dirname,
    formatName: 'camelCase',
    resolverOptions: { register: awilix.asFunction, lifetime: awilix.Lifetime.SINGLETON },
  },
);

container.register({
  authStrategies: awilix.asFunction(authStrategies),
  db: awilix.asValue(db),
  validator: awilix.asValue(validator),
});

module.exports = container;
