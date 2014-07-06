var Tab = require('../models/tab')
  , fs = require('fs')
  , uploadPath = 'public/uploads/';

saveDbData = function(tmp, msg, res) {
	tmp.save(function(err, log) {
		if(err) return console.error(err);
	});

	res.send({message: msg});
};

updateDbData = function(tmp, msg, res) {
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
};

removeDbData = function(tabId, msg, res) {
	var query = new Object({tab: tabId});
	Tab.findOne(query, function(err, doc) {
		if(err) return console.error(err);
		doc.remove(function(err, log) {
			if(err) return console.error(err);
		});
	});

	deleteData(tabId, res);
	res.send({message: msg});
};

deleteData = function(tabId, res) {
	var query = new Object({tab: tabId});
	Tab.findOne(query, function(err, doc) {
		if(err) return console.error(err);
		fs.exists(uploadPath+tabId+'.png', function(exists) {
			if(exists) {
				fs.unlink(uploadPath+tabId+'.png', function(err) {
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
};

randomString = function(length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var string_length = length > 0 ? length : 10;
	var randomString = '';
	for (var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomString += chars.substring(rnum, rnum + 1);
	}
	return randomString;
};

module.exports.saveDbData = saveDbData;
module.exports.updateDbData = updateDbData;
module.exports.removeDbData = removeDbData;
module.exports.deleteData = deleteData;
module.exports.randomString = randomString;
