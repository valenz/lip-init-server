/**
 * Module dependencies.
 */
var pkg = require('./package')
  , flash = require('connect-flash')
  , path = require('path')
  , express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , favicon = require('serve-favicon')
  , morgan = require('morgan')
  , expressSession = require('express-session')
  , errorHandler = require('errorhandler')
  , multer = require('multer');

/**
 * Route dependencies
 */
var routes = require('./routes/routes')

/**
 * Model dependencies
 */
var Tab = require('./models/tab');
var Account = require('./models/account');

/**
 * Mongo database
 */
var mongod = 'mongodb://localhost/lipinit';

/**
 * Configure Express
 */
var app = express();
app.set('port', process.env.PORT || 9002);
app.set('env', process.argv[2] || process.env.NODE_ENV || 'development');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.use(multer());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use(expressSession({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: 'keyboard cat'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

if('development' == app.get('env')) {
	app.use(errorHandler({showStack: true, dumpExceptions: true}));
};

if('production' == app.get('env')) {
	app.use(errorHandler());
};




/**
 * Configure passport
 * 
 * To support persistent login sessions, Passport needs to be able to
 * serialize users into and deserialize users out of the session.
 * Use static authenticate method of model in LocalStrategy.
 */
// passport.use(new LocalStrategy(Account.authenticate()));

/**
 * The createStrategy is responsible to setup passport-local LocalStrategy with the correct options.
 */
passport.use(Account.createStrategy());

/**
 * Use static serialize and deserialize of model for passport session support.
 */
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());




/**
 * Connect mongoose
 */
mongoose.connect(mongod);




/**
 * Configure routes
 */
app.get('/', routes.index);
app.get('/help', routes.help);
app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/settings', routes.settings);
app.get('/settings/:id?', routes.ensureAuthenticated, routes.tabDetails);
app.get('/user', routes.ensureAuthenticated, routes.user);
app.get('/user/details', routes.ensureAuthenticated, routes.userDetails);
app.get('/createaccount', routes.createAccount); // Add 'routes.ensureAuthenticated' to prevent user creation for everyone
app.get('/updateaccount', routes.ensureAuthenticated, routes.updateAccount);
app.get('/createtab', routes.ensureAuthenticated, routes.createTab);
app.get('/updatetab', routes.ensureAuthenticated, routes.updateTab);

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), routes.postLogin);
app.post('/createaccount', routes.postCreateAccount);
app.post('/updateaccount', routes.postUpdateAccount);
app.post('/deleteaccount', routes.postDeleteAccount);
app.post('/createtab', routes.postCreateTab);
app.post('/updatetab', routes.postUpdateTab);
app.post('/deletetab', routes.postDeleteTab);




/**
 * Fires the server.
 */
var server = http.createServer(app);
server.listen(app.get('port'), function() {
	console.log(pkg.name + ' listening on %s:%d in %s mode.', server.address().address, server.address().port, app.settings.env);
});