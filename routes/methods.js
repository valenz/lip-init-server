var fs = require('fs')
  , phantom = require('phantom'), _page
  , uploadPath = 'public/uploads/'
  , Tab = require('../models/tab')
  , Acc = require('../models/account')
  , Set = require('../models/setting');
  



phantom.create('--web-security=no', '--ignore-ssl-errors=yes', function(ph) {
	ph.createPage(function(page) {
		_page = page;
		console.log('Phantom bridge initiated and page created.');
	});
});

module.exports.saveDbData = function(tmp, msg, res) {
	_page.open(tmp.url, function(status) {
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
				
				var name = tmp.name == '' ? result.title.length > 19 ? result.title.substring(0, 19)+'...' : result.title == '' ? tmp.url : result.title : tmp.name;
				
				var data = new Tab({
					name: name,
					url: tmp.url,
					title: result.title,
					icon: result.icon
				});
	
				console.log('UPLOAD.DATA: '+data);
				data.save(function(err, doc) {
					if(err) return console.error(err);
					console.log('URL-Status: ['+status+'] UPLOAD: '+doc._id);
					
					_page.set('viewportSize', {width:960,height:540});
					_page.set('clipRect', {top:0,left:0,width:960,height:540});
					_page.render(uploadPath+doc._id+'.png');
					
				});
				
				ressend('message', msg, res);
				
			}, "title");
		} else {
			var name = tmp.name == '' ? tmp.url.length > 19 ? tmp.url.substring(0, 19)+'...' : tmp.url : tmp.name;
			
			var data = new Tab({
				name: name,
				url: tmp.url,
				title: tmp.url,
				icon: ""
			});

			console.log('UPLOAD.DATA: '+data);
			data.save(function(err, doc) {
				if(err) return console.error(err);
				console.log('URL-Status: ['+status+'] UPLOAD: '+doc._id);
			});
				
			ressend('message', msg, res);
		}
	});
};

module.exports.updateDbData = function(tmp, msg, res) {
	var query = new Object({_id: tmp.id});
	Tab.findOne(query, function(err, doc) {
		if(err) return console.error(err);
		_page.open(tmp.url, function(status) {
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
					
					var name = tmp.name == '' ? result.title.length > 19 ? result.title.substring(0, 19)+'...' : result.title == '' ? tmp.url : result.title : tmp.name;
					
					doc.name = name;
					doc.url = tmp.url;
					doc.title = result.title;
					doc.icon = result.icon;
					doc.__v = doc.__v + 1;
					
					console.log('UPDATE.DATA: '+doc);
					doc.save(function(err, doc) {
						if(err) return console.error(err);
						console.log('URL-Status: ['+status+'] UPDATE: '+doc._id);
						
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath+tmp.id+'.png');
						
					});
					
					ressend('message', msg, res);
					
				}, "title");
			} else {
				var name = tmp.name == '' ? tmp.url.length > 19 ? tmp.url.substring(0, 19)+'...' : tmp.url : tmp.name;
			
				doc.name = name;
				doc.url = tmp.url;
				doc.title = tmp.url;
				doc.icon = "";
				doc.__v = doc.__v + 1;

				console.log('UPDATE.DATA: '+doc);
				doc.save(function(err, doc) {
					if(err) return console.error(err);
					console.log('URL-Status: ['+status+'] UPDATE: '+doc._id);
				});
					
				ressend('message', msg, res);
			}
		});
	});
};

module.exports.removeDbData = function(id, msg, res) {
	var query = new Object({_id: id});
	Tab.findOne(query, function(err, doc) {
		if(err) return console.error(err);
		doc.remove(function(err, log) {
			if(err) return console.error(err);
			console.log('REMOVE.DB: '+doc._id);
		});
	});

	ressend('message', msg, res);
};

module.exports.deleteData = function(id, res) {
	var query = new Object({_id: id});
	Tab.findOne(query, function(err, doc) {
		if(err) return console.error(err);
		fs.exists(uploadPath+id+'.png', function(exists) {
			if(exists) {
				fs.unlink(uploadPath+id+'.png', function(err) {
					if(err) {
						ressend('error', 'Error No: '+err.errno+"; Can't delete file. "+err+'.', res);
						return;
					}
					console.log('REMOVE.FILE: '+id);
				});
			} else {
				console.log('Incorrect path or file "'+ id +'.png" does not exists.');
			}
		});
	});
};

module.exports.secLogin = function(req, msg, res) {
	var login = req.login ? true : false;
	
	Set.findOne({login: !login}, function(err, doc) {
		if(err) return console.error(err);
		if(login) {
			doc.login = true;
			doc.save(function(err, doc) {
				if(err) {
					ressend('error', 'Error No: '+err.errno+"; Can't save changes. "+err+'.', res);
					return console.error(err);
				} else {
					ressend('message', msg, res);
				}
			});
		} else {
			doc.login = false;
			doc.save(function(err, doc) {
				if(err) {
					ressend('error', 'Error No: '+err.errno+"; Can't save changes. "+err+'.', res);
					return console.error(err);
				} else {
					ressend('message', msg, res);
				}
			});
		}
	});
};

module.exports.createuser = function(req, msg, res) {
	// The passport-local-mongoose package automatically takes care of salting and hashing the password. 
	var user = new Object({
		username: req.username
	});
	if(req.password === req.confirm) {
		Acc.register(new Acc(user), req.password, function(err, account) {
			if(err) {
				ressend('error', err.name+': '+err.message+'.', res);
				return console.error(err);
			} else {
				ressend('message', msg, res);
			}
		});
	} else {
		ressend('error', 'User could not be created. Passwords do not match.', res);
	}
};

module.exports.login = function(msg, res) {
	ressend('message', msg, res);
};

function ressend(message, msg, res) {
	var obj = new Object();
	obj[message] = msg;
	res.send(obj);
}