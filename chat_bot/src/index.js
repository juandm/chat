const bootstrapper = require('./setup/bootstrap');

bootstrapper
  .setupApplication()
  .then(() => {
    console.log('StockBot running.');
  })
  .catch((error) => {
    console.log(error);
  });
