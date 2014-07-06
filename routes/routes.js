var mongoose = require('mongoose')
  , passport = require('passport')
  , phantom = require('phantom'), _page
  , methods = require('./methods')
  , Tab = require('../models/tab')
  , uploadPath = 'public/uploads/';

exports.index = function(req, res) {
	var tmp = new Object();

	Tab.find(function(err, tabs) {
		if(err) return console.error(err);
		tmp["grid"] = tabs;
		tmp["user"] = req.user;
		tmp["message"] = req.flash('error');
		res.render('index', tmp);
	});
};

/** Simple route middleware to ensure user is authenticated.
  * Use this route middleware on any resource that needs to be protected.  If
  * the request is authenticated (typically via a persistent login session),
  * the request will proceed.  Otherwise, the user will be redirected to the
  * login page.
  */
exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}

exports.login = function(req, res) {
	res.redirect('/');
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.tabs = function(req, res) {
	mongoose.model('tabs').find(function(err, tabs) {
		res.send(tabs);
	});
};

exports.accounts = function(req, res) {
	mongoose.model('accounts').find(function(err, accounts) {
		res.send(accounts);
	});
};

exports.remove = function(req, res) {
	msg = 'Tab has been successfully removed.';

	methods.removeDbData(req.body.tabId, msg, res);
};

exports.upload = function(req, res) {
	var url = req.body.tabTextUrl,
	name = req.body.tabTextName.length > 17 ? req.body.tabTextName.substring(0, 17)+'...' : req.body.tabTextName;
	tabId = req.body.edit ? req.body.edit : methods.randomString(8);
	
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
						});
						
						msg = 'Tab has been successfully updated.';

						methods.deleteData(data.tab, res);
						
						methods.updateDbData(data, msg, res);
										
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath+tabId+'.png');
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
					});

					methods.deleteData(data.tab, res);
					
					methods.updateDbData(data, msg, res);
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
						});
						var msg = 'Tab has been successfully added to grid.';
						
						methods.saveDbData(data, msg, res);
						
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath+tabId+'.png');
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
					});
					var msg = 'Tab has been successfully added to grid.';
					
					methods.saveDbData(data, msg, res);
				}
			});
		}
};

phantom.create('--web-security=no', '--ignore-ssl-errors=yes', function(ph) {
	ph.createPage(function(page) {
		_page = page;
		console.log('Phantom bridge initiated and page created.');
	});
});
