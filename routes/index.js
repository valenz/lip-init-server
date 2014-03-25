var fs = require('fs');

exports.index = function(req, res) {
	fs.readFile('public/data/data', 'utf8', function(err, data) {
		if(err) throw err;
		try {
			var arr = {'grid': {'tabs': JSON.parse('[' + data + ']')}}
			res.render('index', arr);
		} catch(e) {
			res.render('index', {'error': e + '.'})
		}
	});
};

