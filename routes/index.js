var fs = require('fs');
exports.index = function(req, res) {
	fs.readFile('public/data/data.json', 'utf8', function(err, data) {
		if(err) throw err;
		
		var arr = {'grid': {'tabs': JSON.parse('[' + data + ']')}}
		res.render('index', arr);
	});
};
