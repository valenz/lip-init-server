/**
 * Module dependencies.
 */

var flash = require('connect-flash')
  , express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy
  , phantom = require('phantom'), _page
  , http = require('http')
  , fs = require('fs')
  , path = require('path');
  
var routes = require('./routes/routes')
  , db = require('./config/db')
  , users = require('./config/user');




function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) {
		fn(null, users[idx]);
	} else {
		fn(new Error('User does not exist'));
	}
}

function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}


// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
		done(err, user);
	});
});


// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.  In the real world, this would query a database;
// however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
	function(username, password, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {

			// Find the user by username.  If there is no user with the given
			// username, or the password is not correct, set the user to `false` to
			// indicate failure and set a flash message.  Otherwise, return the
			// authenticated `user`.
			findByUsername(username, function(err, user) {
				if (err) { return done(err); }
				if (!user || user.password != password) {
					return done(null, false, { message: 'Unknown user or invalid password' });
				}
				return done(null, user);
			})
		});
	}
));




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
app.post('/api/login', passport.authenticate('local', { 
	failureRedirect: '/',
	failureFlash: true
}), function(req, res) {
	res.redirect('/');
});

app.get('/api/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
// Use this route middleware on any resource that needs to be protected.  If
// the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}




app.post('/api/option', function(req, res) {
	data = new Object();
	data["sql"] = 'DELETE FROM tabs WHERE tab="'+req.body.tabId+'"';
	data["msg"] = 'Tab has been successfully deleted.';
	
	deleteDbData('SELECT img FROM tabs WHERE tab="'+req.body.tabId+'"', res);
	updateGrid(data, res);
});




app.post('/api/upload', function(req, res) {
	var url = req.body.tabTextUrl,
		name = req.body.tabTextName.length > 17 ? req.body.tabTextName.substring(0, 17)+'...' : req.body.tabTextName;
		tabId = req.body.edit ? req.body.edit : randomString(9);
	
	var imagePath = 'uploads/'+tabId+'.png',
		uploadPath = 'public/'+imagePath;
	
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
						name = req.body.tabTextName == '' ? result.title.length > 17 ? result.title.substring(0, 17)+'...' : result.title : name,
						data["sql"] = 'UPDATE tabs SET '+
							'name="'+name+'",'+
							'url="'+url+'",'+
							'title="'+result.title+'",'+
							'icon="'+result.icon+'",'+
							'img="'+imagePath+'" WHERE tab="'+tabId+'"';
						data["msg"] = 'Tab has been successfully updated.';

						deleteDbData('SELECT img FROM tabs WHERE tab="'+tabId+'"', res);
						
						updateGrid(data, res);
										
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath);
					}, "title");
				/** Edit: Url is NOT valid */
				} else {
					console.log('edited > '+tabId);
					console.log('url_status > '+status);
					
					var data = new Object();
					name = req.body.tabTextName == '' ? url.length > 17 ? url.substring(0, 17)+'...' : url : name,
					data["sql"] = 'UPDATE tabs SET '+
						'name="'+name+'",'+
						'url="'+url+'",'+
						'title="'+url+'",'+
						'icon="",'+
						'img="" WHERE tab="'+tabId+'"';
					data["msg"] = 'Tab has been successfully updated.';

					deleteDbData('SELECT img FROM tabs WHERE tab="'+tabId+'"', res);
					
					updateGrid(data, res);
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
						
						var data = new Object();
						name = req.body.tabTextName == '' ? result.title.length > 17 ? result.title.substring(0, 17)+'...' : result.title : name,
						data["sql"] = 'INSERT INTO tabs (tab,name,url,title,icon,img) VALUES ('+
							'"'+tabId+'","'+name+'","'+url+'","'+result.title+'","'+result.icon+'","'+imagePath+'")';
						data["msg"] = 'Tab has been successfully added to grid.';
						
						updateGrid(data, res);
						
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath);
					}, "title");
				/** Upload: Url is NOT valid */
				} else {
					console.log('uploaded > '+tabId);
					console.log('url_status > '+status);
					
					var data = new Object();
					name = req.body.tabTextName == '' ? url.length > 17 ? url.substring(0, 17)+'...' : url : name,
					data["sql"] = 'INSERT INTO tabs (tab,name,url,title,icon,img) VALUES ('+
						'"'+tabId+'","'+name+'","'+url+'","'+url+'","","")';
					data["msg"] = 'Tab has been successfully added to grid.';
					
					updateGrid(data, res);
				}
			});
		}
});




function updateGrid(obj, res) {
	updateDbData(obj.sql);
	res.send({message: obj.msg});
}

function updateDbData(sql) {
	db.getConnection(function(err, connection) {
		if(err) throw err;	
		connection.query(sql, function(err) {
			if(err) throw err;
			connection.destroy();
		});

	});
}

function deleteDbData(sql, res) {
	db.getConnection(function(err, connection) {
		if(err) throw err;	
		connection.query(sql, function(err, rows) {
			if(err) throw err;
			fs.exists('public/'+rows[0].img, function(exists) {
				if(exists) {
					fs.unlink('public/'+rows[0].img, function(err) {
						if(err) {res.send({error: 'Error No: '+err.errno+"; Can't delete file. "+err+'.'}); return;}
					});
				}
			});
			connection.destroy();
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




http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port') + ".");
});




phantom.create('--web-security=no', '--ignore-ssl-errors=yes', function(ph) {
	ph.createPage(function(page) {
		_page = page;
		console.log('Phantom bridge initiated and page created.');
	});
});
