var url = require('url')
  , phantom = require('phantom')
  , mongoose = require('mongoose')
  , methods = require('./methods')
  , uploadPath = 'public/uploads/'
  , page;

/**
 *********************************** GET ***********************************
 */
 
/**
 * Selects all documents in collection tab, sorted by the field whenCreated
 * in descending order and pass a local variable to the user page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.index = function(req, res) {
	mongoose.model('tab').find({}, null, { sort: { whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
		if(err) return console.error(err);
		res.render('index', {
			title: 'Index',
			grid: tab,
			user: req.user,
			info: req.flash('info'),
			error: req.flash('error'),
			success: req.flash('success')
		});
	});
};

/**
 * Selects all documents in collection tab, sorted by the field whenCreated
 * in descending order and pass a local variable to the user page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.user = function(req, res) {
	mongoose.model('tab').find({}, null, { sort: { whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
		if(err) return console.error(err);
		res.render('sites/user', {
			title: req.user.username,
			grid: tab,
			user: req.user,
			info: req.flash('info'),
			error: req.flash('error'),
			success: req.flash('success')
		});
	});
};

/**
 * Selects all documents in collection tab and account, sorted by the field name
 * in ascending order and pass a local variable to the settings page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.settings = function(req, res) {
	mongoose.model('tab').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, tab) {
		if(err) return console.error(err);
		mongoose.model('account').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, acc) {
			if(err) return console.error(err);
			res.render('sites/settings', {
				title: 'Settings',
				accs: acc,
				tabs: tab,
				user: req.user,
				info: req.flash('info'),
				error: req.flash('error'),
				success: req.flash('success')
			});
		});
	});
};

/**
 * Pass a local variable to the help page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.help = function(req, res) {
	res.render('sites/help', {
		title: 'Help',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

/**
 * Pass a local variable to the login form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.login = function(req, res) {
	res.render('forms/login', {
		title: 'Login',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

/**
 * Calls the exported function logout in methods
 * and redirect to the given url.
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.logout = function(req, res) {
	methods.logout(req, res);
	res.redirect('/');
};

/**
 * Pass a local variable to the create_account form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.createAccount = function(req, res) {
	res.render('forms/create_account', {
		title: 'Create Account',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

/**
 * Pass a local variable to the update_account form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.updateAccount = function(req, res) {
	res.render('forms/update_account', {
		title: 'Update Account',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

/**
 * Pass a local variable to the create_tab form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.createTab = function(req, res) {
	res.render('forms/create_tab', {
		title: 'Create Tab',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

/**
 * Pass a local variable to the update_tab form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.updateTab = function(req, res) {
	res.render('forms/update_tab', {
		title: 'Update Tab',
		query: req.query,
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

/**
 * Pass a local variable to the user_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.userDetails = function(req, res) {
	res.render('forms/user_details', {
		title: 'User Details',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

/**
 * Pass a local variable to the tab_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.tabDetails = function(req, res) {
	res.render('forms/tab_details', {
		title: 'Tab Details',
		query: req.query,
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

/**
 *********************************** POST ***********************************
 */

/**
 * Sets a flash message by passing the key, followed by the value, to req.flash()
 * and redirect to the given url.
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.postLogin = function(req, res) {
	req.flash('success', 'You are logged in. Welcome, '+req.user.username+'!');
	res.redirect('/user');
};

/**
 * Creates a new object with request parameters from the submitted form name attributes
 * and try to save the object to the collection account as a new document.
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.postCreateAccount = function(req, res) {
	// The passport-local-mongoose package automatically takes care of salting and hashing the password.
	var user = new Object({
		username: req.body.username,
		whoCreated: req.user ? req.user.username : req.body.username,
		whenCreated: new Date(),
		whenUpdated: 0
	});
	var Account = mongoose.model('account');
	if(req.body.password === req.body.confirm) {
		try {
			Account.register(new Account(user), req.body.password, function(err) {
				if(err) {
					req.flash('error', err.message);
					res.redirect('/createaccount');
					return console.error(err);
				} else {
					req.flash('success', 'Account has been created successfully.');
					res.redirect('/createaccount');
				}
			});
		} catch(e) {
			console.error(e.stack);
			res.redirect('/createaccount');
		}
	} else {
		req.flash('info', 'Account could not be created. Passwords did not match.');
		res.redirect('/createaccount');
	}
};

/**
 * TODO
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.postUpdateAccount = function(req, res) {
	var query = new Object({ _id: req.user._id });
	console.log('REQUEST.USER: '+req.user);
	console.log('REQUEST.BODY: ');
	console.log(req.body);
	mongoose.model('account').findOne(query, function(err, doc) {
		if(err) {
			req.flash('error', err);
			res.redirect('/settings');
			return console.error(err);
		} else {
			console.log('FOUND.DOC: '+doc);
			req.flash('info', 'Not yet implemented.');
			//req.flash('success', JSON.stringify(doc));
			res.redirect('/settings');
		}
	});
};

/**
 * Selects all documents in collection account with queried object
 * and try to remove the document from the collection.
 * Calls the exported function logout in methods
 * and redirect to the given url.
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.postDeleteAccount = function(req, res) {
	var query = new Object({ _id: req.body.id });
	mongoose.model('account').findOne(query, function(err, doc) {
		if(err) return console.error(err);
		try {
			doc.remove(function(err) {
				if(err) {
					req.flash('error', err);
					res.redirect('/');
					return console.error(err);
				} else {
					console.log('Account '+doc+' was deleted successfully from the database.');
					req.flash('success', 'Your Account has been deleted successfully.');
					methods.logout(req, res);
					res.redirect('/');
				}
			});
		} catch(e) {
			console.error(e.stack);
			res.redirect('/');
		}
	});
};

/**
 * Creates a new Tab with request parameters from the submitted form name attributes.
 * Opens the given url and loads it to the page and provides the page status to the
 * function ('success' or 'fail'). Evaluates the given function in the
 * context of the web page and try to save the document to the collection.
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.postCreateTab = function(req, res) {
	console.log('REQUEST.BODY: ');
	console.log(req.body);
	page.open(req.body.address, function(stat) {
		/** Get title and icon from a webpage */
		page.evaluate(function() {
			var data = new Object();
			document.body.bgColor = 'white';
			data['title'] = document.title;
			var icon = document.getElementsByTagName('link');
			for(var i in icon) {
				try {
					if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
						data['icon'] = icon[i].href;
						return data;
					}
				} catch(e) {
					data['icon'] = 'https://plus.google.com/_/favicon?domain_url=' + window.location.origin;
					console.error(e.stack);
					return data;
				}
			}
		}, function(result) {
			/** Url is valid */
			var Tab = mongoose.model('tab');
			if(stat == 'success') {
				var name = req.body.name ? req.body.name.length > 50 ? req.body.name.substring(0, 50)+'...' : req.body.name : result.title.length > 50 ? result.title.substring(0, 50)+'...' : result.title;

				var data = new Tab({
					name: name,
					url: req.body.address,
					title: result.title,
					icon: result.icon,
					check: req.body.check ? true : false,
					whoCreated: req.user.username,
					whoUpdated: '-',
					whenCreated: new Date(),
					whenUpdated: undefined
				});
			} else {
				var name = req.body.name ? req.body.name.length > 50 ? req.body.name.substring(0, 50)+'...' : req.body.name : req.body.address.length > 20 ? req.body.address.substring(0, 20)+'...' : req.body.address;

				var data = new Tab({
					name: name,
					url: req.body.address,
					title: req.body.address,
					icon: '',
					check: req.body.check ? true : false,
					whoCreated: req.user.username,
					whoUpdated: '-',
					whenCreated: new Date(),
					whenUpdated: undefined
				});
			}
			console.log('UPLOAD.DATA: '+data);
			try {
				data.save(function(err, doc) {
					if(err) {
						req.flash('error', err);
						res.redirect('/createtab');
						return console.error(err);
					} else {
						console.log('Tab '+ doc +' was created successfully with URL-Status: ['+ stat +']');
						// Renders the web page to an image buffer and saves it as the specified filename.
						page.render(uploadPath+doc._id + '.png');
						req.flash('success', 'Tab has been created successfully.');
						res.redirect('/createtab');
					}
				});
			} catch(e) {
				console.error(e.stack);
				res.redirect('/createtab');
			}
		}, 'title');
	});
};

/**
 * Updated the given Tab with request parameters from the submitted form name
 * attributes.
 * Opens the given url and loads it to the page and provides the page status to the
 * function ('success' or 'fail'). Evaluates the given function in the
 * context of the web page and try to save the document to the collection.
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.postUpdateTab = function(req, res) {
	console.log('REQUEST.BODY: ');
	console.log(req.body);
	var query = new Object({ _id: req.body.id });
	mongoose.model('tab').findOne(query, function(err, doc) {
		if(err) return console.error(err);
		page.open(req.body.address, function(stat) {
			/** Get title and icon from a webpage */
			page.evaluate(function() {
				var data = new Object();
				document.body.bgColor = 'white';
				data['title'] = document.title;
				var icon = document.getElementsByTagName('link');
				for(var i in icon) {
					try {
						if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
							data['icon'] = icon[i].href;
							return data;
						}
					} catch(e) {
						data['icon'] = 'https://plus.google.com/_/favicon?domain_url=' + window.location.origin;
						console.error(e.stack);
						return data;
					}
				}
			}, function(result) {
				/** Url is valid */
				if(stat == 'success') {
					var name = req.body.name ? req.body.name.length > 50 ? req.body.name.substring(0, 50)+'...' : req.body.name : result.title.length > 50 ? result.title.substring(0, 50)+'...' : result.title;

					doc.name = name;
					doc.url = req.body.address;
					doc.title = result.title;
					doc.icon = result.icon;
					doc.check = req.body.check ? true : false;
					doc.whoCreated = doc.whoCreated;
					doc.whoUpdated = req.user.username;
					doc.whenCreated = doc.whenCreated;
					doc.whenUpdated = new Date();
					doc.__v = doc.__v + 1;
				} else {
					var name = req.body.name ? req.body.name > 50 ? req.body.name.substring(0, 50)+'...' : req.body.name : req.body.address.length > 20 ? req.body.address.substring(0, 20)+'...' : req.body.address;

					doc.name = name;
					doc.url = req.body.address;
					doc.title = req.body.address;
					doc.icon = '';
					doc.check = req.body.check;
					doc.whoCreated = doc.whoCreated;
					doc.whoUpdated = req.user.username;
					doc.whenCreated = doc.whenCreated;
					doc.whenUpdated = new Date();
					doc.__v = doc.__v + 1;
				}
				console.log('UPDATE.DATA: '+doc);
				try {
					doc.save(function(err, doc) {
						if(err) {
							req.flash('error', err);
							res.redirect('/');
							return console.error(err);
						} else {
							console.log('Tab '+ doc +' was updated successfully with URL-Status: ['+ stat +']');
							// Renders the web page to an image buffer and saves it as the specified filename.
							page.render(uploadPath+req.body.id + '.png');
							req.flash('success', 'Tab has been updated successfully.');
							req.body.check ? res.redirect('/user') : res.redirect('/');
						}
					});
				} catch(e) {
					console.error(e.stack);
					res.redirect('/');
				}
			}, 'title');
		});
	});
};

/**
 * Selects all documents in collection tab with queried object
 * and try to remove the document from the collection.
 * Calls the exported function clear in methods
 * and redirect to the given url.
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.postDeleteTab = function(req, res) {
	var query = new Object({ _id: req.body.id });
	mongoose.model('tab').findOne(query, function(err, doc) {
		if(err) return console.error(err);
		try {
			doc.remove(function(err) {
				if(err) {
					req.flash('error', err);
					res.redirect('back');
					return console.error(err);
				} else {
					methods.clear(req);
					console.log('Tab '+ doc +' was deleted successfully from the database.');
					req.flash('success', 'Tab has been deleted successfully.');
					res.redirect('back');
				}
			});
		} catch(e) {
			console.error(e.stack);
			res.redirect('back');
		}
	});
};

/**
 * Simple route middleware to ensure user is authenticated.
 * Use this route middleware on any resource that needs to be protected.  If
 * the request is authenticated (typically via a persistent login session),
 * the request will proceed.  Otherwise, the user will be redirected to the
 * login form page.
 * @param {Object} req 
 * @param {Object} res
 * @param {Function} next
 * @return {return} next
 */
module.exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}

/**
 * Makes new PhantomJS WebPage objects. Pass command line switches to the
 * phantomjs process by specifying additional args.
 * @param {Object} ph
 */
phantom.create('--config=config.json', function(ph) {
	ph.createPage(function(p) {
		p.set('settings.javascriptEnabled', true); // default: true
		p.set('settings.resourceTimeout', 60 * 1000); // 60 seconds
		// defines the rectangular area of the web page to be rasterized when page.render is invoked
		p.set('clipRect', { top: 0, left: 0, width: 960, height: 540});
		// sets the size of the viewport for the layout process
		p.set('viewportSize', { width: 960, height: 540 });

		console.log('PHANTOM.PROCESS.PID:', ph.process.pid);
		page = p;

		// This callback is invoked when the page requests a resource.
		page.onResourceRequested = function(requestData, networkRequest) {
			console.log('ON.RESOURCE.REQUESTED: Request (ID: #' + requestData.id + '): ' + JSON.stringify(requestData));
		};

		// This callback is invoked when a resource requested by the page is received (for every chuck if supported).
		page.onResourceReceived = function(response) {
			console.log('ON.RESOURCE.RECEIVED: Response (ID: #' + response.id + ', STAGE: "' + response.stage + '"): ' + JSON.stringify(response));
		};

		// This callback is invoked when a resource requested by the page timeout.
		page.onResourceTimeout = function(request) {
			console.log('ON.RESOURCE.TIMEOUT: Response (ID: #' + request.id + '): ' + JSON.stringify(request));
		};

		// This callback is invoked when a web page was unable to load resource.
		page.set('onResourceError', function(resourceError) {
			console.log('ON.RESOURCE.ERROR: Unable to load resource (ID: #' + resourceError.id + ' URL: ' + resourceError.url + ')');
			console.log('ON.RESOURCE.ERROR: Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
		});
	});
});
