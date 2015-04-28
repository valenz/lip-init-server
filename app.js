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
app.set('port', process.env.PORT || config.app.set.port);
app.set('address', process.env.ADDRESS || config.app.set.address);
app.set('env', process.argv[2] || process.env.NODE_ENV || config.env);

app.set('views', __dirname + config.app.set.views);
app.set('view engine', config.app.set.engine);
app.set('view options', config.app.set.options);

app.use(favicon(__dirname + config.app.set.favicon));
app.use(multer());

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

  return '\x1b['+color+'m'+status;
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
app.get('/help', routes.help);
app.get('/login', routes.login);
app.get('/logout', routes.ensureAuthenticated, routes.logout);
app.get('/settings', routes.settings);
app.get('/settings/logging', routes.ensureAuthenticated, routes.logging);
app.get('/accounts/:username', routes.ensureAuthenticated, routes.accounts);
app.get('/settings/account/create', /*routes.ensureAuthenticated,*/ routes.accountCreate); // Add 'routes.ensureAuthenticated' to prevent user creation for everyone
app.get('/settings/account/update', routes.ensureAuthenticated, routes.accountUpdate);
app.get('/settings/account/details/:id?', routes.ensureAuthenticated, routes.accountDetails);
app.get('/settings/category/create', routes.ensureAuthenticated, routes.categoryCreate);
app.get('/settings/category/update', routes.ensureAuthenticated, routes.categoryUpdate);
app.get('/settings/category/details/:id?', routes.ensureAuthenticated, routes.categoryDetails);
app.get('/settings/tab/create', routes.ensureAuthenticated, routes.tabCreate);
app.get('/settings/tab/update', routes.ensureAuthenticated, routes.tabUpdate);
app.get('/settings/tab/details/:id?', routes.ensureAuthenticated, routes.tabDetails);

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid username or password.' }), routes.postLogin);
app.post('/settings/account/create', routes.postAccountCreate);
app.post('/settings/account/update', routes.postAccountUpdate);
app.post('/settings/account/delete', routes.postAccountDelete);
app.post('/settings/category/create', routes.postCategoryCreate);
app.post('/settings/category/update', routes.postCategoryUpdate);
app.post('/settings/category/delete', routes.postCategoryDelete);
app.post('/settings/tab/create', routes.postTabCreate);
app.post('/settings/tab/update', routes.postTabUpdate);
app.post('/settings/tab/delete', routes.postTabDelete);
app.post('/settings/:type(account|category|tab)/delete/confirm', routes.postConfirm);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if(req.user) {
    var err = new Error();
    err.message = 'Failed to load resource "'+ req.url +'". The server responded with a status of 404 (Not Found).';
    err.status = 404;
    err.method = req.method;
    err.header = req.headers;
    err.url = req.url;
    next(err);
  } else {
    res.redirect('/');
  }
});

// Handles uncaught exceptions.
process.on('uncaughtException', function (e) {
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
var server = http.createServer(app);
server.listen(app.get('port'), app.get('address'), function() {
  log.info('%s (%s) is running. Process id is %d.', process.title, process.version, process.pid);
  log.info('%s listening on %s:%d in %s mode.', pkg.name, server.address().address, server.address().port, app.settings.env);
});
