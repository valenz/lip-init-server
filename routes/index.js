var fs = require('fs');

exports.index = function(req, res) {
	fs.readFile('public/data/data', 'utf8', function(err, data) {
		if(err) throw err;
		try {
			res.render('index', JSON.parse(data));
		} catch(e) {
			res.render('index', {'error': e + '.'})
		}
		var d = new Object();
		d["tab2"] = "OTRS";
		var h = new String();
		
		//console.log(randomString(2));
	});
};
