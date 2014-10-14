var mongoose = require('mongoose')
  , methods = require('./methods');

module.exports.index = function(req, res) {
	mongoose.model('tabs').find({}, null, {sort:{name:1}, skip:0, limit:0}, function(err, doc) {
		if(err) return console.error(err);
		mongoose.model('settings').find(function(err, set) {
			if(err) return console.error(err);
			res.render('index', {
				grid: doc,
				sets: set,
				user: req.user,
				message: req.flash('error')
			});
		});
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
	methods.ensure('Not allowed!', res);
	//res.redirect('/');
}

module.exports.secLogin = function(req, res) {
	methods.secLogin(req.body, 'Settings has been updated successfully.', res);
};

module.exports.createuser = function(req, res) {
	methods.createuser(req.body, 'User has been created successfully.', res);
};

module.exports.login = function(req, res) {
	methods.login('Login successfully.', res);
};

module.exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

module.exports.settings = function(req, res) {
	mongoose.model('tabs').find(function(err, tab) {
		if(err) return console.error(err);
		mongoose.model('accounts').find(function(err, acc) {
			if(err) return console.error(err);
			mongoose.model('settings').find(function(err, set) {
				if(err) return console.error(err);
				res.render('settings', {
					sets: set,
					accs: acc,
					tabs: tab,
					user: req.user,
					message: req.flash('error')
				});
			});
		});
	});
};

module.exports.getItem = function(req, res) {
	var query = new Object({_id: req.params.id});
	mongoose.model('tabs').findOne(query, function(err, doc) {
		if(err) return console.error(err);
		if(!doc) {
			mongoose.model('accounts').findOne(query, function(err, doc) {
				if(err) return console.error(err);
				res.send(doc);
			});
		} else {
			res.send(doc);
		}
	});
};

module.exports.remove = function(req, res) {
	methods.deleteData(req.body.tabId, res);
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