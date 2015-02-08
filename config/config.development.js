var config = require('./config.global');

// Overrides global config (run Node with NODE_ENV=development)

config.env = 'development';

module.exports = config;
