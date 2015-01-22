var fs = require('fs');

/**
 ********************************* METHODS *********************************
 */

/**
 * Set a flash message by passing the key, followed by the value, to req.flash()
 * and remove the req.user property and clear the login session.
 * @param {Object} req 
 * @param {Object} res
 */
module.exports.logout = function(req, res) {
	req.flash('success', 'You are logged out.');
	req.logout();
};

/**
 * Extracts the characters from a string, between two specified indices,
 * (where n is the last one) and returns the new sub string.
 * @param {str} String
 * @param {n} Number
 */
module.exports.shorter = function(str, n) {
	return str.length > n ? str.substring(0, n)+'...' : str;
};

/**
 * Test whether or not the given path exists by checking with the file system
 * and try to delete the path file.
 * @param {Object} req 
 * @param {Object} res
 * @return {String} err
 */
module.exports.clear = function(req) {
	var path = 'public/uploads/';
	var file = req.body.id+'.png';
	fs.exists(path + file, function(exists) {
		if(exists) {
			try {
				fs.unlink(path + file, function(err) {
					req.flash('error', err);
					if(err) return console.error(err);
					console.log('DELETE.FILE: '+req.body.id);
				});
			} catch(e) {
				console.error(e.stack);
				req.flash('error', e.message);
			}
		} else {
			req.flash('note', 'Incorrect '+ path +' or '+ file +' does not exists.');
		}
	});
};