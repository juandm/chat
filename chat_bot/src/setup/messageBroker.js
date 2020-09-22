const amqp = require('amqplib');
const stockService = require('../services/stockService');

async function receiveMessage(channel, message) {
  console.log('[StockBot] Message arrived to the bot');
  console.log('RequestId:', message.properties.correlationId);
  const data = JSON.parse(message.content.toString());
  const responseMessage = stockService.processMessage(data);
  if (responseMessage) {
    channel.ack(message);
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
}

async function setup() {
  const url = process.env.MESSAGE_BROKER_URL;
  const incomeMessagesQueue = process.env.INCOME_QUEUE;
  const { channel } = await createBrokerConnection(url);
  await setupConsumer(channel, incomeMessagesQueue, receiveMessage);
}

module.exports = { setup };
