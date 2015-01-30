/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');

var pkg = require('./package');
var flash = require('connect-flash');
var http = require('http');
var expressSession = require('express-session');
var multer = require('multer');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Configure Express
 */
var app = express();
app.set('port', process.env.PORT || 9002);
app.set('env', process.argv[2] || process.env.NODE_ENV || 'development');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(multer());
app.use(morgan('dev'));

app.use(expressSession({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: 'keyboard cat'
}));

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

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
mongoose.connect('mongodb://localhost/lipinit', function(err) {
	if (err) {
		console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
	}
});

// Route dependencies
var routes = require('./routes/routes')

// Configure routes
app.get('/', routes.index);
app.get('/help', routes.help);
app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/settings', routes.settings);
app.get('/account', routes.ensureAuthenticated, routes.account);
app.get('/settings/tab/create', routes.ensureAuthenticated, routes.createTab);
app.get('/settings/tab/update', routes.ensureAuthenticated, routes.updateTab);
app.get('/settings/tab/details/:id?', routes.ensureAuthenticated, routes.tabDetails);
app.get('/settings/account/create', routes.createAccount); // Add 'routes.ensureAuthenticated' to prevent user creation for everyone
app.get('/settings/account/update', routes.ensureAuthenticated, routes.updateAccount);
app.get('/settings/account/details/:id?', routes.ensureAuthenticated, routes.userDetails);
app.get('/settings/category/create', routes.ensureAuthenticated, routes.createCategory);
app.get('/settings/category/update', routes.ensureAuthenticated, routes.updateCategory);
app.get('/settings/category/details/:id?', routes.ensureAuthenticated, routes.categoryDetails);

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), routes.postLogin);
app.post('/createcategory', routes.postCreateCategory);
app.post('/updatecategory', routes.postUpdateCategory);
app.post('/deletecategory', routes.postDeleteCategory);
app.post('/createaccount', routes.postCreateAccount);
app.post('/updateaccount', routes.postUpdateAccount);
app.post('/deleteaccount', routes.postDeleteAccount);
app.post('/createtab', routes.postCreateTab);
app.post('/updatetab', routes.postUpdateTab);
app.post('/deletetab', routes.postDeleteTab);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Failed to load resource: the server responded with a status of 404 (Not Found)');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.enable('verbose errors');
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		console.error(err);
		res.render('index', {
			fallover: err.message,
			message: JSON.stringify(err)
		});
	});
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
	app.disable('verbose errors');
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		console.error(err);
		res.render('index', {
			fallover: err.message,
			message: JSON.stringify({})
		});
	});
}

/**
 * Fires the server.
 */
var server = http.createServer(app);
server.listen(app.get('port'), function() {
	console.log(pkg.name + ' listening on %s:%d in %s mode.', server.address().address, server.address().port, app.settings.env);
});
