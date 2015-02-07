var config = require('./config.global');

// Overrides global config

// Environment settings
config.env = 'test';

// App settings
config.app.set.port = 9090;

// Database settings
config.db.name = '/liptest';

module.exports = config;
