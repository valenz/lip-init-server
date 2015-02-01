var fs = require('fs');

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

module.exports.getAdminTabs = function(obj) {
  if(!obj) return 0;
  var n = 0;
  for(var i in obj) if(obj[i].check) n++;
  return n;
};

module.exports.getAssignedTabs = function(obj) {
  if(!obj) return 0;
  var n = 0;
  for(var i in obj) n += obj[i].list.length;
  return n;
};

/**
 * Extracts the characters from a string, between two specified indices,
 * (where n is the last one) and returns the new sub string.
 * @param {str} String
 * @param {n} Number
 * @return {str} String
 */
module.exports.shorter = function(str, n) {
  if(!str) return false;
	return str.length > n ? str.substring(0, n)+'...' : str;
};

/**
 * Removes items from an array, and returns the new one.
 * @param {str} String
 * @param {obj} Object
 * @return {data} Object
 */
module.exports.detach = function(str, obj) {
  if(!obj) return false;
  var data = obj;
  var list = obj.list;
  var index = list.indexOf(str);
  if(index == -1) return false;
  list.splice(index, 1);
  data.list = list;
  return data;
};

/**
 * Adds new items to the end of an array, and returns the new one.
 * @param {str} String
 * @param {obj} Object
 * @return {data} Object
 */
module.exports.paste = function(str, obj) {
  if(!obj) return false;
  var data = obj;
  var list = obj.list;
  list.push(str);
  data.list = list;
  return data;
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
	var file = req.body.id +'.png';
	fs.exists(path + file, function(exists) {
		if(exists) {
			try {
				fs.unlink(path + file, function(err) {
          if(err) {
            req.flash('error', err);
            return console.error(err);
          }
					console.log('DELETE.FILE: '+ req.body.id);
				});
			} catch(e) {
				console.error(e.stack);
				req.flash('error', e.message);
			}
		} else {
			req.flash('note', 'Incorrect '+ path +' or '+ file +' does not exists.');
			console.error('Incorrect '+ path +' or '+ file +' does not exists.');
		}
	});
};
