var config = module.exports = {};

// Global default settings (run Node without set NODE_ENV)

// Environment settings
config.env = 'development';



// App settings
// Requires package dependencies
config.app = {};
config.app.set = {};
// Sets port where server listen to
config.app.set.port = 9002;
// Sets location of view pages
config.app.set.views = '/views';
// Sets view render engine
config.app.set.engine = 'jade';
// Sets view options
config.app.set.options = {};
config.app.set.options.layout = false;
// Sets location of static client side content
config.app.set.static = 'public';
// Sets location of the favicon
config.app.set.favicon = '/'+ config.app.set.static +'/images/favicon.ico';



// Database settings
config.db = {};
config.db.uri = process.env.MONGO_URI || 'localhost';
config.db.name = '/tabgrid';



// PhantomJS settings
// For further informations check:
// https://www.npmjs.com/package/phantom
// http://phantomjs.org/api/command-line.html
// http://phantomjs.org/api/webpage/property/settings.html
config.ph = {};
config.ph.render = {};

// Renders the web page to an image buffer [PNG|GIF|JPEG|PDF]
config.ph.render.format = 'jpeg';
// JPEG compression quality. A higher number will look better, but creates a larger file
config.ph.render.quality = '100';

// Number of milliseconds to wait after a page loads before taking the screenshot
config.ph.render.delay = 500;

// When taking the screenshot, adds a white background otherwise adds color.value
config.ph.render.color = {};
config.ph.render.color.defaultWhiteBackground = false;
config.ph.render.color.value = '#F6F6F6';

// Specifies the scaling factor
config.ph.render.zoom = 0.15;

// Defines the rectangular area of the web page to be rasterized
config.ph.render.clip = {};
config.ph.render.clip.top = 0;
config.ph.render.clip.left = 0;
config.ph.render.clip.width = 160;
config.ph.render.clip.height = 90;

// Sets the size of the viewport for the layout process
config.ph.render.viewport = {};
config.ph.render.viewport.width = 160;
config.ph.render.viewport.height = 90;

config.ph.evaluate = {};
// Number of milliseconds to wait after a page evaluates before returns sanboxed content
config.ph.evaluate.delay = 100;

config.ph.settings = {};
config.ph.settings.clo = {};
config.ph.settings.clo.parameters = {};

// Ignores SSL errors, such as expired or self-signed certificate errors
config.ph.settings.clo.parameters['ignore-ssl-errors'] = false;

// Sets the SSL protocol for secure connections
config.ph.settings.clo.parameters['ssl-protocol'] = 'any';

// Sets the encoding used for terminal output
config.ph.settings.clo.parameters['output-encoding'] = 'utf8';

// Sets the encoding used for the starting script
config.ph.settings.clo.parameters['script-encoding'] = 'utf8';

// Defines whether to execute the script in the page or not
config.ph.settings.javascriptEnabled = true;

// Defines whether to load the inlined images or not
config.ph.settings.loadImages = true;

// Defines whether local resource (e.g. from file) can access remote URLs or not
config.ph.settings.localToRemoteUrlAccessEnabled = false;

// Defines the user agent sent to server when the web page requests resources
config.ph.settings.userAgent = '';

// Sets the user name used for HTTP authentication
config.ph.settings.userName = '';

// Sets the password used for HTTP authentication
config.ph.settings.password = '';

// Defines whether load requests should be monitored for cross-site scripting attempts
config.ph.settings.XSSAuditingEnabled = false;

// Defines whether web security should be enabled or not
config.ph.settings.webSecurityEnabled = false;

// Defines the timeout after which any resource requested will stop trying
// and proceed with other parts of the page
config.ph.settings.resourceTimeout = 30 * 1000;



// Custom settings
config.custom = {}
// Path to uploaded content
config.custom.upload = config.app.set.static +'/uploads/';
