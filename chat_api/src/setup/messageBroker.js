const amqp = require('amqplib');
const { messageReceivedEmitter } = require('../utils/messageReceivedEmitter');
const sendMessageEmitter = require('../utils/sendMessageEmitter');

let publishChannel = null;

async function receiveMessage(channel, message) {
  console.log('[ChatAPI] Message arrived from the bot');
  const data = JSON.parse(message.content.toString());
  console.log(data);
  if (data) {
    channel.ack(message);
    messageReceivedEmitter.emit('bot_message_received', data);
  } else {
    console.log('Error replying message to the chat server');
  }
}

async function createBrokerConnection(url) {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();
  return { connection, channel };
}

async function setupConsumer(channel, queue, receiveCallback) {
  // create queue
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, (message) => receiveCallback(channel, message));
  publishChannel = channel;
}

async function setup() {
  const url = process.env.MESSAGE_BROKER_URL;
  const responseMessagesQueue = process.env.RESPONSES_QUEUE;
  const { channel } = await createBrokerConnection(url);
  await setupConsumer(channel, responseMessagesQueue, receiveMessage);
}

async function sendMessage(message) {
  const options = {
    persistent: true,
    contentType: 'application/json',
  };
  publishChannel.sendToQueue(
    process.env.INCOME_QUEUE,
    Buffer.from(JSON.stringify(message), 'utf-8'),
    options,
  );
  console.log(`Bot request message sent: stock_id = ${message.content}`);
}

sendMessageEmitter.on('request_bot_message', sendMessage);

module.exports = { setup };
