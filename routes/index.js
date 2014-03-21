var fs = require('fs');
exports.index = function(req, res) {
	fs.readdir('public/uploads', function(err, files) {
		var arr = {'grid': {'image': []}};
		for(file in files) {
			if(files[file].charAt(0) != '.') {
				arr.grid.image.push('/uploads/' + files[file]);
			}
		}
		res.render('index', arr);
	});
};
