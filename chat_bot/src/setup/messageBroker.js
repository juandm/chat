const amqp = require('amqplib');
const stockService = require('../services/stockService');

async function receiveMessage(channel, message) {
  console.log('[StockBot] Message arrived to the bot');
  const data = JSON.parse(message.content.toString());
  const stockResponse = await stockService.processMessage(data);
  data.content = stockResponse;
  data.isBotMessage = true;
  data.createdAt = new Date().toISOString();
  console.log('Message sent to the chat from bot', JSON.stringify(data, null, 4));
  if (stockResponse) {
    channel.sendToQueue(process.env.RESPONSES_QUEUE, Buffer.from(JSON.stringify(data)));
    channel.ack(message);
  } else {
    console.log('Error replying message to the chat server');
  }
}

async function createBrokerConnection(url) {
  const connection = await amqp.connect(url);
  const consumerChannel = await connection.createChannel();
  return { connection, consumerChannel };
}

async function setupConsumer(channel, queue, receiveCallback) {
  // create queue
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, (message) => receiveCallback(channel, message));
}

async function setup() {
  const url = process.env.MESSAGE_BROKER_URL;
  const incomeMessagesQueue = process.env.INCOME_QUEUE;
  const { consumerChannel } = await createBrokerConnection(url);
  await setupConsumer(consumerChannel, incomeMessagesQueue, receiveMessage);
}

module.exports = { setup };
