const { EventEmitter } = require('events');

class SendMessageEmitter extends EventEmitter {}
const sendMessageEmitter = new SendMessageEmitter();

module.exports = sendMessageEmitter;
