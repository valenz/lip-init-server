var mongoose = require('mongoose')
  , methods = require('./methods')
  , Tab = require('../models/tab');

module.exports.index = function(req, res) {
	Tab.find(function(err, doc) {
		if(err) return console.error(err);
		var tmp = new Object({
			grid: doc,
			user: req.user,
			message: req.flash('error')
		});
		res.render('index', tmp);
	});
};

/** Simple route middleware to ensure user is authenticated.
  * Use this route middleware on any resource that needs to be protected.  If
  * the request is authenticated (typically via a persistent login session),
  * the request will proceed.  Otherwise, the user will be redirected to the
  * login page.
  */
module.exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}

module.exports.login = function(req, res) {
	res.redirect('/');
};

module.exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

module.exports.tabs = function(req, res) {
	mongoose.model('tabs').find(function(err, tabs) {
		res.send(tabs);
	});
};

module.exports.accounts = function(req, res) {
	mongoose.model('accounts').find(function(err, accounts) {
		res.send(accounts);
	});
};

module.exports.remove = function(req, res) {
	methods.removeDbData(req.body.tabId, 'Tab has been successfully removed.', res);
};

module.exports.upload = function(req, res) {
	var url = req.body.tabTextUrl,
	name = req.body.tabTextName.length > 19 ? req.body.tabTextName.substring(0, 19)+'...' : req.body.tabTextName;
	
	console.log('REQUEST.BODY: '+JSON.stringify(req.body));
		
		/** Edit tab */
		if (req.body.edit) {
			var data = new Object({
				id: req.body.edit,
				name: name,
				url: url
			});
			console.log('REQUEST.UPDATE: '+JSON.stringify(data));
			
			methods.deleteData(data.id, res);
			methods.updateDbData(data, 'Tab has been successfully updated.', res);
		} else {
			var data = new Object({
				name: name,
				url: url
			});
			console.log('REQUEST.UPLOAD: '+JSON.stringify(data));
			
			methods.saveDbData(data, 'Tab has been successfully added to grid.', res);
		}
};
