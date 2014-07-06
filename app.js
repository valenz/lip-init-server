/**
 * Module dependencies.
 */
var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose').connect('mongodb://localhost/tabs')
  , phantom = require('phantom'), _page
  , http = require('http')
  , fs = require('fs')
  , path = require('path');

/**
 * Routes dependencies
 */
var routes = require('./routes/routes');

/**
 * Modules dependencies
 */
var Tab = require('./models/tab');
var Account = require('./models/account');




// use static authenticate method of model in LocalStrategy
passport.use(Account.createStrategy());
//passport.use(new LocalStrategy(Account.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());




// The passport-local-mongoose package automatically takes care of salting and hashing the password. 
Account.register(new Account({ username : "bob" }), "secret", function(err, account) {
	if(err) return console.error(err);
});




var app = express();

// configure Express
app.configure(function() {
	app.set('port', process.env.PORT || 9090);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));	
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.errorHandler());
});




app.get('/', routes.index);
app.post('/api/login', passport.authenticate('local', {failureRedirect:'/', failureFlash:true}), routes.login);
app.get('/api/logout', ensureAuthenticated, routes.logout);

app.get('/api/tabs', ensureAuthenticated, routes.tabs);
app.get('/api/accounts', ensureAuthenticated, routes.accounts);




app.post('/api/remove', ensureAuthenticated, function(req, res) {
	msg = 'Tab has been successfully removed.';

	removeDbData(req.body.tabId, msg, res);
});

var uploadPath = 'public/uploads/';
app.post('/api/upload', ensureAuthenticated, function(req, res) {
	var url = req.body.tabTextUrl,
	name = req.body.tabTextName.length > 17 ? req.body.tabTextName.substring(0, 17)+'...' : req.body.tabTextName;
	tabId = req.body.edit ? req.body.edit : randomString(9);
	
	var image = tabId+'.png';
	
	console.log(req.body);
		
		/** Edit tab */
		if (req.body.edit) {
			_page.open(url, function(status) {
				/** Edit: Url is valid */
				if(status == 'success') {
					/** Get title and icon from a webpage */
					_page.evaluate(function() {
						var data = new Object();
						data["title"] = document.title;
						//data["url"] = window.location.origin;
						var icon = document.getElementsByTagName('link');
						for(var i in icon) {
							try {
								if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
									data["icon"] = icon[i].href;
									return data;
								}
							} catch(e) {
								data["icon"] = 'https://plus.google.com/_/favicon?domain_url='+window.location.origin;
								return data;
							}
						}
					}, function(result) {
				
						console.log('edited > '+tabId);
						console.log('url_status > '+status);
						console.log(result);
						
						var data = new Object();
						name = req.body.tabTextName == '' ? result.title.length > 17 ? result.title.substring(0, 17)+'...' : result.title : name;

						var data = new Tab({
							tab: tabId
						      , name: name
						      , url: url
						      , title: result.title
						      , icon: result.icon
						      , img: image
						});
						
						msg = 'Tab has been successfully updated.';

						deleteData(data.tab, res);
						
						updateDbData(data, msg, res);
										
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath+image);
					}, "title");
				/** Edit: Url is NOT valid */
				} else {
					console.log('edited > '+tabId);
					console.log('url_status > '+status);
					
					name = req.body.tabTextName == '' ? url.length > 17 ? url.substring(0, 17)+'...' : url : name;
					var data = new Tab({
						tab: tabId
					      , name: name
					      , url: url
					      , title: url
					      , icon: ""
					      , img: ""
					});

					deleteData(data.tab, res);
					
					updateDbData(data, msg, res);
				}
			});
		/** Upload tab */
		} else {
			_page.open(url, function(status) {
				/** Upload: Url is valid */
				if(status == 'success') {
					/** Get title and icon from a webpage */
					_page.evaluate(function() {
						var data = new Object();
						data["title"] = document.title;
						//data["url"] = window.location.origin;
						var icon = document.getElementsByTagName('link');
						for(var i in icon) {
							try {
								if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
									data["icon"] = icon[i].href;
									return data;
								}
							} catch(e) {
								data["icon"] = 'https://plus.google.com/_/favicon?domain_url='+window.location.origin;
								return data;
							}
						}
					}, function(result) {
				
						console.log('uploaded > '+tabId);
						console.log('url_status > '+status);
						console.log(result);
						
						name = req.body.tabTextName == '' ? result.title.length > 17 ? result.title.substring(0, 17)+'...' : result.title : name;
						var data = new Tab({
							tab: tabId
						      , name: name
						      , url: url
						      , title: result.title
						      , icon: result.icon
						      , img: image
						});
						var msg = 'Tab has been successfully added to grid.';
						
						saveDbData(data, msg, res);
						
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath+image);
					}, "title");
				/** Upload: Url is NOT valid */
				} else {
					console.log('uploaded > '+tabId);
					console.log('url_status > '+status);
					
					name = req.body.tabTextName == '' ? url.length > 17 ? url.substring(0, 17)+'...' : url : name;
					var data = new Tab({
						tab: tabId
					      , name: name
					      , url: url
					      , title: url
					      , icon: ""
					      , img: ""
					});
					var msg = 'Tab has been successfully added to grid.';
					
					saveDbData(data, msg, res);
				}
			});
		}
});




/** Simple route middleware to ensure user is authenticated.
  * Use this route middleware on any resource that needs to be protected.  If
  * the request is authenticated (typically via a persistent login session),
  * the request will proceed.  Otherwise, the user will be redirected to the
  * login page.
  */
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}

function saveDbData(tmp, msg, res) {
	tmp.save(function(err, log) {
		if(err) return console.error(err);
	});

	res.send({message: msg});
}

function updateDbData(tmp, msg, res) {
	var query = new Object({tab: tmp.tab});
	Tab.findOne(query, function(err, doc) {
		if(err) return console.error(err);
		doc.tab = tmp.tab
	      , doc.name = tmp.name
	      , doc.url = tmp.url
	      , doc.title = tmp.title
	      , doc.icon = tmp.icon
	      , doc.img = tmp.img;
	      	
		saveDbData(doc, msg, res);
	});
}

function removeDbData(tabId, msg, res) {
	var query = new Object({tab: tabId});
	Tab.findOne(query, function(err, doc) {
		if(err) return console.error(err);
		doc.remove(function(err, log) {
			if(err) return console.error(err);
		});
	});

	deleteData(tabId, res);
	res.send({message: msg});
}

function deleteData(tabId, res) {
	var query = new Object({tab: tabId});
	Tab.findOne(query, function(err, doc) {
		if(err) return console.error(err);
		fs.exists(uploadPath+doc.img, function(exists) {
			if(exists) {
				fs.unlink(uploadPath+doc.img, function(err) {
					if(err) {
						res.send({
							error: 'Error No: '+err.errno+"; Can't delete file. "+err+'.'
						});
						return;
					}
				});
			} else {
				console.log('Incorrect path or Image "'+ doc.img +'" does not exists.');
			}
		});
	});
}

function randomString(length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var string_length = length > 0 ? length : 10;
	var randomstring = '';
	for (var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
}




phantom.create('--web-security=no', '--ignore-ssl-errors=yes', function(ph) {
	ph.createPage(function(page) {
		_page = page;
		console.log('Phantom bridge initiated and page created.');
	});
});




http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port') + ".");
});
