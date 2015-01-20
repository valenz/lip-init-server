var url = require('url')
  , phantom = require('phantom')
  , mongoose = require('mongoose')
  , methods = require('./methods')
  , uploadPath = 'public/uploads/'
  , _page;

/**
 *********************************** GET ***********************************
 */
module.exports.index = function(req, res) {
	mongoose.model('tab').find({}, null, {sort:{name:1}, skip:0, limit:0}, function(err, tab) {
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

module.exports.user = function(req, res) {
	mongoose.model('tab').find({}, null, {sort:{name:1}, skip:0, limit:0}, function(err, tab) {
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

module.exports.settings = function(req, res) {
	mongoose.model('tab').find({}, null, {sort:{name:1}, skip:0, limit:0}, function(err, tab) {
		if(err) return console.error(err);
		mongoose.model('account').find({}, null, {sort:{name:1}, skip:0, limit:0}, function(err, acc) {
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

module.exports.help = function(req, res) {
	res.render('sites/help', {
		title: 'Help',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

module.exports.login = function(req, res) {
	res.render('forms/login', {
		title: 'Login',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

module.exports.logout = function(req, res) {
	methods.logout(req, res);
	res.redirect('/');
};

module.exports.createAccount = function(req, res) {
	res.render('forms/create_account', {
		title: 'Create Account',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

module.exports.updateAccount = function(req, res) {
	res.render('forms/update_account', {
		title: 'Update Account',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

module.exports.createTab = function(req, res) {
	res.render('forms/create_tab', {
		title: 'Create Tab',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

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

module.exports.userDetails = function(req, res) {
	res.render('forms/user_details', {
		title: 'User Details',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
};

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
module.exports.postLogin = function(req, res) {
	req.flash('success', 'You are logged in. Welcome, '+req.user.username+'!');
	res.redirect('/user');
};

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
			req.flash('error', e.message);
		}
	} else {
		req.flash('info', 'Account could not be created. Passwords did not match.');
		res.redirect('/createaccount');
	}
};

/**
 * TODO
 */
module.exports.postUpdateAccount = function(req, res) {
	var query = new Object({ _id: req.user._id });
	console.log('REQUEST.USER: '+req.user);
	console.log('REQUEST.BODY: ');
	console.log(req.body);
	mongoose.model('account').findOne(query, function(err, doc) {
		if(err) {
			req.flash('error', err);
			return console.error(err);
		} else {
			console.log('FOUND.DOC: '+doc);
			req.flash('info', 'Not yet implemented.');
			//req.flash('success', JSON.stringify(doc));
			res.redirect('/settings');
		}
	});
};

module.exports.postDeleteAccount = function(req, res) {
	var query = new Object({ _id: req.body.id });
	mongoose.model('account').findOne(query, function(err, doc) {
		if(err) return console.error(err);
		try {
			doc.remove(function(err) {
				if(err) {
					req.flash('error', err);
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
			req.flash('error', e.message);
			res.redirect('/');
		}
	});
};

module.exports.postCreateTab = function(req, res) {
	console.log('REQUEST.BODY: ');
	console.log(req.body);
	_page.open(req.body.address, function(stat) {
		/** Get title and icon from a webpage */
		_page.evaluate(function() {
			var data = new Object();
			document.body.bgColor = 'white';
			data['title'] = document.title;
			//data['url'] = window.location.origin;
			var icon = document.getElementsByTagName('link');
			for(var i in icon) {
				try {
					if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
						data['icon'] = icon[i].href;
						return data;
					}
				} catch(e) {
					data['icon'] = 'https://plus.google.com/_/favicon?domain_url='+window.location.origin;
					return data;
				}
			}
		}, function(result) {
			/** Upload: Url is valid */
			var Tab = mongoose.model('tab');
			if(stat == 'success') {
				var name = req.body.name ? req.body.name > 19 ? req.body.name.substring(0, 19)+'...' : req.body.name : result.title.length > 19 ? result.title.substring(0, 19)+'...' : result.title;

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
				var name = req.body.name ? req.body.name > 19 ? req.body.name.substring(0, 19)+'...' : req.body.name : req.body.address.length > 19 ? req.body.address.substring(0, 19)+'...' : req.body.address;

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
						return console.error(err);
					} else {
						console.log('Tab '+doc+' was created successfully with URL-Status: ['+stat+']');

						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath+doc._id+'.png');

						req.flash('success', 'Tab has been created successfully.');
						res.redirect(url.parse(req.url).pathname);
					}
				});
			} catch(e) {
				console.error(e.stack);
				req.flash('error', e.message);
				res.redirect(url.parse(req.url).pathname);
			}
		}, 'title');
	});
};

module.exports.postUpdateTab = function(req, res) {
	console.log('REQUEST.BODY: ');
	console.log(req.body);
	var query = new Object({ _id: req.body.id });
	mongoose.model('tab').findOne(query, function(err, doc) {
		if(err) return console.error(err);
		_page.open(req.body.address, function(stat) {
			/** Get title and icon from a webpage */
			_page.evaluate(function() {
				var data = new Object();
				document.body.bgColor = 'white';
				data['title'] = document.title;
				//data['url'] = window.location.origin;
				var icon = document.getElementsByTagName('link');
				for(var i in icon) {
					try {
						if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
							data['icon'] = icon[i].href;
							return data;
						}
					} catch(e) {
						data['icon'] = 'https://plus.google.com/_/favicon?domain_url='+window.location.origin;
						return data;
					}
				}
			}, function(result) {
				/** Edit: Url is valid */
				if(stat == 'success') {
					var name = req.body.name ? req.body.name > 19 ? req.body.name.substring(0, 19)+'...' : req.body.name : result.title.length > 19 ? result.title.substring(0, 19)+'...' : result.title;

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
					var name = req.body.name ? req.body.name > 19 ? req.body.name.substring(0, 19)+'...' : req.body.name : req.body.address.length > 19 ? req.body.address.substring(0, 19)+'...' : req.body.address;

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
							return console.error(err);
						} else {
							console.log('Tab '+doc+' was updated successfully with URL-Status: ['+stat+']');

							_page.set('viewportSize', {width:960,height:540});
							_page.set('clipRect', {top:0,left:0,width:960,height:540});
							_page.render(uploadPath+req.body.id+'.png');

							req.flash('success', 'Tab has been updated successfully.');
							req.body.check ? res.redirect('/user') : res.redirect('/');
						}
					});
				} catch(e) {
					console.error(e.stack);
					req.flash('error', e.message);
					res.redirect(url.parse(req.url).pathname);
				}
			}, 'title');
		});
	});
};

module.exports.postDeleteTab = function(req, res) {
	var query = new Object({ _id: req.body.id });
	methods.clear(req);
	mongoose.model('tab').findOne(query, function(err, doc) {
		if(err) return console.error(err);
		try {
			doc.remove(function(err) {
				if(err) {
					req.flash('error', err);
					return console.error(err);
				} else {
					console.log('Tab '+doc+' was deleted successfully from the database.');
					req.flash('success', 'Tab has been deleted successfully.');
					res.redirect('/');
				}
			});
		} catch(e) {
			console.error(e.stack);
			req.flash('error', e.message);
			res.redirect('/');
		}
	});
};

/** Simple route middleware to ensure user is authenticated.
 * Use this route middleware on any resource that needs to be protected.  If
 * the request is authenticated (typically via a persistent login session),
 * the request will proceed.  Otherwise, the user will be redirected to the
 * login page.
 */
module.exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}

phantom.create('--web-security=no','--ignore-ssl-errors=true','--ssl-protocol=tlsv1', function(ph) {
	ph.createPage(function(page) {
		_page = page;

		_page.set('onResourceError',function(resourceError) {
			console.log('ON.RESOURCE.ERROR: Unable to load resource (ID: #' + resourceError.id + ' URL:' + resourceError.url + ')');
			console.log('ON.RESOURCE.ERROR: Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
		});
	});
});