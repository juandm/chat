const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv-safe');

const loadEnvironmentVars = () => {
  // Load environment variables
  const envFilePath = path.join(__dirname, '..', 'config/env/.env');
  const envExampleFilePath = path.join(__dirname, '..', 'config/env/.env.example');

  if (fs.existsSync(envFilePath)) {
    dotenv.config({
      allowEmptyValues: false,
      example: envExampleFilePath,
      path: envFilePath,
    });
  }
};

module.exports = { loadEnvironmentVars };
