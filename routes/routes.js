var db = require('../config/db');

exports.index = function(req, res) {
	var tmp = new Object();

	db.getConnection(function(err, connection) {
		if(err) throw err;
		connection.query('SELECT * FROM tabs', function(err, rows, fields) {
			if(err) throw err;
			tmp["grid"] = rows;
			tmp["user"] = req.user;
			res.render('index', tmp);
			connection.destroy();
		});
	});
};

exports.login = function(req, res) {
	var tmp = new Object();
	
	tmp["user"] = req.user;
	tmp["message"] = req.flash('error');
	res.render('login', tmp);
};
