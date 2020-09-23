require('./environment').loadEnvironmentVars();
const MessageBroker = require('./messageBroker');

async function setupMessageBroker() {
  console.log('Setting up Message Broker');
  return MessageBroker.setup();
}

async function setupApplication() {
  const isMessageBrokerUp = setupMessageBroker();
  return { isMessageBrokerUp };
}

module.exports = { setupApplication };
