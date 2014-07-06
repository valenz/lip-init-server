var mongoose = require('mongoose')
  , passport = require('passport')
  , Tabs = require('../models/tab')
  , Account = require('../models/account');

exports.index = function(req, res) {
	var tmp = new Object();

	Tabs.find(function(err, tabs) {
		if(err) return console.error(err);
		tmp["grid"] = tabs;
		tmp["user"] = req.user;
		tmp["message"] = req.flash('error');
		res.render('index', tmp);
	});
};

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
