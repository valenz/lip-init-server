var mysql = require('mysql')
  , pool = mysql.createPool({
  	host: 'localhost',
	user: 'test',
	password: 'secret',
	database: 'db'
  });

exports.getConnection = function(callback) {
	pool.getConnection(function(err, connection) {
		callback(err, connection);
	});
};