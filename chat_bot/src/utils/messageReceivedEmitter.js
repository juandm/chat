const EventEmitter = require('events');

class MessageReceivedEmitter extends EventEmitter {}
const messageReceivedEmitter = new MessageReceivedEmitter();

function addListener(room, cb) {
  messageReceivedEmitter.on(`${room}_message_received`, async (message) => cb(message));
}

module.exports = { messageReceivedEmitter, addListener };
