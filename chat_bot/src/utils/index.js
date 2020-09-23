const fs = require('fs');
const request = require('request');

async function downloadFile(uri, filename) {
  const file = fs.createWriteStream(filename);
  return new Promise((resolve, reject) => {
    request(uri)
      .pipe(file)
      .on('finish', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  }).catch((error) => {
    console.log(`error downloading file: ${error}`);
  });
}

module.exports = { downloadFile };
