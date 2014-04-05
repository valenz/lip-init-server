var fs = require('fs');

exports.index = function(req, res) {
	var filePath = 'public/data/data.json';
	var tmp = new Object();
	tmp["grid"] = new Array();
	fs.exists(filePath, function(exists) {
		if(exists) {
			getJson(filePath, res);
		} else {
			fs.writeFile(filePath, JSON.stringify(tmp), function(err) {
				if(err) {res.send({error: err.errno+": Can't write file. " + err + '.'}); return;}
				getJson(filePath, res);
			});
		}
	});
};

function getJson(url, res) {
	fs.readFile(url, 'utf8', function(err, data) {
		if(err) {res.send({error: err.errno+": Can't read file. " + err + '.'}); return;}
		try {
			res.render('index', JSON.parse(data));
		} catch(e) {
			res.render('index', {'error': e + '.'})
		}
	});
}
