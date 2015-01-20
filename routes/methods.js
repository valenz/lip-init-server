var fs = require('fs');

/**
 ********************************* METHODS *********************************
 */
module.exports.date = function() {
	var date = new Date();
	var d = date.getDate();
	var M = date.getMonth();
	var y = date.getFullYear();
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	var today = new Date(y, M, d, h, m, s);
	return today;
};

module.exports.logout = function(req, res) {
	req.flash('success', 'You are logged out.');
	req.logout();
};

/**
 * Deletes file in the file system from given id.
 */
module.exports.clear = function(req) {
	var name = 'public/uploads/'+req.body.id+'.png';
	fs.exists(name, function(exists) {
		if(exists) {
			try {
				fs.unlink(name, function(err) {
					req.flash('error', err);
					if(err) return console.error(err);
					console.log('DELETE.FILE: '+req.body.id);
				});
			} catch(e) {
				console.error(e.stack);
				req.flash('error', e.message);
			}
		} else {
			req.flash('note', 'Incorrect path or file "'+ req.body.id +'.png" does not exists.');
		}
	});
};