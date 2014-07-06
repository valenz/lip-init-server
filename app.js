/**
 * Module dependencies.
 */
var flash = require('connect-flash')
  , path = require('path')
  , express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

/**
 * Route dependencies
 */
var routes = require('./routes/routes')

/**
 * Model dependencies
 */
var Account = require('./models/account');

/**
 * Configure Express
 */
var app = express();
app.set('port', process.env.PORT || 9090);
app.set('env', process.argv[2] || process.env.NODE_ENV || 'development');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser());
app.use(express.session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: 'keyboard cat'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if('development' == app.get('env')) {
	app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
};

if('production' == app.get('env')) {
	app.use(express.errorHandler());
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
 * The passport-local-mongoose package automatically takes care of salting and hashing the password. 
 */
Account.register(new Account({ username : "bob" }), "secret", function(err, account) {
	if(err) return console.error(err);
});




/**
 * Connect mongoose
 */
mongoose.connect('mongodb://localhost/passport_local_mongoose');




/**
 * Configure routes
 */
app.get('/', routes.index);
app.post('/api/login', passport.authenticate('local', {failureRedirect:'/', failureFlash:true}), routes.login);
app.get('/api/logout', routes.ensureAuthenticated, routes.logout);

app.get('/api/tabs', routes.ensureAuthenticated, routes.tabs);
app.get('/api/accounts', routes.ensureAuthenticated, routes.accounts);

app.post('/api/remove', routes.ensureAuthenticated, routes.remove);
app.post('/api/upload', routes.ensureAuthenticated, routes.upload);




/**
 * Fires the server.
 */
http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on %s:%d in %s mode.", '127.0.0.1', app.get('port'), app.settings.env);
});
