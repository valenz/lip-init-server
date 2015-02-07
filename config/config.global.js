var config = module.exports = {};

// Environment settings
config.env = 'development';

// App settings
config.app = {};
config.app.set = {};
config.app.set.port = 9002;
config.app.set.views = '/views';
config.app.set.engine = 'jade';
config.app.set.static = 'public';
config.app.set.favicon = '/'+ config.app.set.static +'/images/favicon.ico';
config.app.set.options = {};
config.app.set.options.layout = false;

// Database settings
config.db = {};
config.db.uri = process.env.MONGO_URI || 'localhost';
config.db.name = '/lipinit';

// PhantomJS settings
config.ph = {};
config.ph.render = {};
config.ph.render.format = '.png';
config.ph.render.delay = 500;
config.ph.render.color = '#F6F6F6';

config.ph.evaluate = {};
config.ph.evaluate.delay = 500;

config.ph.settings = {};
config.ph.settings.clo = [
  '--ignore-ssl-errors=true',
  '--ssl-protocol=any',
  '--web-security=false',
  '--output-encoding=utf8'
];
config.ph.settings.timeout = 30 * 1000;
config.ph.settings.zoom = 0.75;

config.ph.settings.clip = {};
config.ph.settings.clip.top = 0;
config.ph.settings.clip.left = 0;
config.ph.settings.clip.width = 480;
config.ph.settings.clip.height = 270;

config.ph.settings.viewport = {};
config.ph.settings.viewport = 480;
config.ph.settings.viewport = 270;

// Custom settings
config.custom = {}
config.custom.upload = config.app.set.static +'/uploads/';
