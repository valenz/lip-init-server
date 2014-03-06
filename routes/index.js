var fs = require('fs');
exports.index = function(req, res) {
	fs.readdir('public/uploads', function(err, files) {
		var arr = {'grid': {'image': []}};
		for(file in files) {
			arr.grid.image.push('/uploads/' + files[file]);
		}
		res.render('index', arr);
	});
};
