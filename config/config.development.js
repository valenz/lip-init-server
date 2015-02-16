var config = require('./config.global');

// Overrides global config (run Node with NODE_ENV=development)

config.env = 'development';
config.loggers.log.file.level = 'debug';

module.exports = config;
