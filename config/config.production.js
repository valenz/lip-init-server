var config = require('./config.global');

// Overrides global config (run Node with NODE_ENV=production)

config.env = 'production';

module.exports = config;
