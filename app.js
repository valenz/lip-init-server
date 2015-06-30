var server = require('ghost');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');

var pkg = require('./package');
var config = require('./config');
var winston = require('winston');
var flash = require('connect-flash');
var http = require('http');
var expressSession = require('express-session');
var multer = require('multer');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Logging
winston.loggers.add('log', config.loggers.log);
var log = winston.loggers.get('log');
log.transports.console.label = pkg.name;
log.exitOnError = false;

// Configure Express
var app = express();
app.set('views', __dirname + config.app.set.views);
app.set('view engine', config.app.set.engine);
app.set('view options', config.app.set.options);

app.use(favicon(__dirname + config.app.set.favicon));

// Request logger status codes
morgan.token('locale', function(req, res) {
  return new Date().toISOString().substr(0, 11) + new Date().toLocaleTimeString();
});

morgan.token('status', function(req, res) {
  var color = 32; // green
  var status = res.statusCode;

  if (status >= 500) color = 31; // red
  else if (status >= 400) color = 33; // yellow
  else if (status >= 300) color = 36; // cyan

  return '\x1b[' + color + 'm' + status;
});

app.use(morgan(config.app.set.morgan));

app.use(expressSession(config.app.cookie.options));

app.use(flash());

app.use(express.static(path.join(__dirname, config.app.set.static)));

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use account model for authentication
var Tab = require('./models/tab');
var Account = require('./models/account');
var Category = require('./models/category');
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Connect mongoose
var uri = process.env.DB_URI || config.db.uri;
mongoose.connect(uri + config.db.name, function(err) {
  if (err) {
    log.error('Could not connect to mongodb on %s.', uri);
    log.warn('Ensure that you have mongodb running on %s and mongodb accepts connections on standard ports!', uri);
  }
});

// Route dependencies
var routes = require('./routes/routes');

// Configure routes
app.get('/', routes.index);
app.get('/info', routes.help);
app.get('/login', routes.login);
app.get('/logout', routes.ensureAuthenticated, routes.logout);
app.get('/settings', routes.settings);
app.get('/settings/logging', routes.ensureAuthenticated, routes.logging);
app.get('/accounts/:username', routes.ensureAuthenticated, routes.accounts);
app.get('/settings/account/create', routes.ensureAuthenticated, routes.accountCreate); // Add 'routes.ensureAuthenticated' to prevent user creation for everyone
app.get('/settings/category/create', routes.ensureAuthenticated, routes.categoryCreate);
app.get('/settings/tab/create', routes.ensureAuthenticated, routes.tabCreate);
app.get('/survey/:name', routes.survey);
app.get('/s?', routes.search);

app.post('/survey/:name', [multer(), routes.postSurvey]);
app.post('/prefer', [multer(), routes.postPrefer]);
app.post('/login', [multer(), passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid username or password.' }), routes.postLogin]);
app.post('/settings/account/create', [multer(), routes.postAccountCreate]);
app.post('/settings/account/update', [multer(), routes.postAccountUpdate]);
app.post('/settings/account/edit', [multer(), routes.ensureAuthenticated, routes.postAccountEdit]);
app.post('/settings/account/details', [multer(), routes.ensureAuthenticated, routes.postAccountDetails]);
app.post('/settings/account/delete', [multer(), routes.postAccountDelete]);
app.post('/settings/category/create', [multer(), routes.postCategoryCreate]);
app.post('/settings/category/update', [multer(), routes.postCategoryUpdate]);
app.post('/settings/category/edit', [multer(), routes.ensureAuthenticated, routes.postCategoryEdit]);
app.post('/settings/category/details', [multer(), routes.ensureAuthenticated, routes.postCategoryDetails]);
app.post('/settings/category/delete', [multer(), routes.postCategoryDelete]);
app.post('/settings/tab/create', [multer(), routes.postTabCreate]);
app.post('/settings/tab/update', [multer(), routes.postTabUpdate]);
app.post('/settings/tab/edit', [multer(), routes.ensureAuthenticated, routes.postTabEdit]);
app.post('/settings/tab/details', [multer(), routes.ensureAuthenticated, routes.postTabDetails]);
app.post('/settings/tab/delete', [multer(), routes.postTabDelete]);
app.post('/settings/:type(account|category|tab)/delete/confirm', [multer(), routes.postConfirm]);

// Handles uncaught exceptions.
process.on('uncaughtException', function(e) {
  log.debug('Caught exception: ', e.stack);
  log.error('Caught exception: ', e.message);
  return;
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.enable('verbose errors');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error(err.message);
    res.render('sites/status', {
      title: err.status,
      user: req.user,
      fallover: err,
      header: err.header,
      message: err.message
    });
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.disable('verbose errors');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error(err.message);
    res.render('sites/status', {
      title: err.status,
      user: req.user,
      fallover: err,
      header: {},
      message: err.message
    });
  });
}

// Fires the server.
server({
  config: path.join(__dirname, 'config.js')
}).then(function(server) {
  log.info('%s (%s) is running. Process id is %d.', process.title, process.version, process.pid);
  app.use(server.config.paths.subdir, server.rootApp);
  server.start(app);
  log.info('%s listening on %s:%d in %s mode.', pkg.name, server.config.server.host, server.config.server.port, app.settings.env);
});
