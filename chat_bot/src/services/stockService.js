const csvToJson = require('csvtojson');
const path = require('path');
const { unlink } = require('fs').promises;
const { downloadFile } = require('../utils');

async function processMessage(message) {
  const url = process.env.STOCK_API_URL;
  const folderName = process.env.DOWNLOAD_FOLDER;
  const stockCode = message.content.split('=')[1];
  const stockUrl = url.replace('{{stock_code}}', stockCode);

  const filePath = path.join(
    __dirname,
    '..',
    folderName,
    `stock_${stockCode.replace('.', '_')}.csv`,
  );

  const responseTemplate = process.env.RESPONSE_TEMPLATE;
  await downloadFile(stockUrl, filePath);

  const data = await csvToJson().fromFile(filePath);
  const responseMessage = responseTemplate
    .replace('{{stock_code}}', data[0].Symbol)
    .replace('{{value}}', data[0].Close);
  await unlink(filePath);

  return responseMessage;
}

module.exports = { processMessage };
