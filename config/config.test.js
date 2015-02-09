var config = require('./config.global');

// Overrides global config (run Node with NODE_ENV=test)

config.env = 'test';
config.app.set.port = 9090;
config.db.name = '/tabtest';

module.exports = config;
