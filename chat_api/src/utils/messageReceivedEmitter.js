const { EventEmitter } = require('events');

class MessageReceivedEmitter extends EventEmitter {}
const messageReceivedEmitter = new MessageReceivedEmitter();

function addListener(eventName, cb) {
  messageReceivedEmitter.on(eventName, async (message) => cb(message));
}

module.exports = { messageReceivedEmitter, addListener };
