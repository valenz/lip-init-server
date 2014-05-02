var db = require('./db');

exports.index = function(req, res) {
	var tmp = new Object();

	db.getConnection(function(err, connection) {
		if(err) throw err;
		connection.query('SELECT * FROM tabs', function(err, rows, fields) {
			if(err) throw err;
			tmp["grid"] = rows;
			res.render('index', tmp);
			connection.destroy();
		});
	});
};