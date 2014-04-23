var fs = require('fs');
exports.index = function(req, res){
	fs.readdir('public/uploads', function(err, files) {
		var html = '';
		for(file in files) {
			html += '<img src="/uploads/'+files[file]+'" />';
		}
		res.send(html);
	});
};
