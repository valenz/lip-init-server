/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , test = require('./routes/test') // test route
  , http = require('http')
  , fs = require('fs')
  , mv = require('mv')
  , path = require('path')
  , app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 8080);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});




app.post('/api/upload', function(req, res) {
	var name = replaceAll(req.body.tabName, { s: ['_','.'], r: [' '] }),
		url = req.body.tabUrl,
		desc = req.body.tabDesc,
		file = req.files.tabFile,
		extension = file.size != 0 ? '.' + file.name.split('.')[1] : '',
		uploadPath = '/public/uploads/' + name + extension,
		data = { "name": name, "desc": desc, "url": url,
			"img": file.size != 0 ? "uploads/" + name + extension : 'images/default-tab-bg.jpg' };
		
	fs.readFile('public/data/data', 'utf8', function(err, getData) {
		if(err) { res.send({ error: "Can't read file. " + err + '.'	});	return; }
		var tmp = getData + JSON.stringify(data),
			tmp = replaceAll(tmp, { s: ['}\n{','}{','{},','{}'], r: ['},\n{','},\n{','',''] });
		
		if(file.size != 0) {
			// mv('source/dir', 'dest/dir', function(err) {});
			// it first created all the necessary directories (mkdirp: true), and then
			// tried fs.rename, then falls back to using ncp to copy the dir
			// to dest and then rimraf to remove the source dir
			// If 'dest/file' exists (clobber: false), an error is returned with err.code === 'EEXIST'.
			mv(file.path, __dirname + uploadPath, {mkdirp:true, clobber: false}, function(err) {
				if(err) {
					res.send({
						error: 'Something went wrong! ' + err + '.'
					});
					return;
				}
				
				addToGrid(res, tmp);
				
				res.send({
					message: 'Tab has been successfully added to grid and file has been uploaded to ' + uploadPath + '.'
				});
			});
		} else {
			addToGrid(res, tmp);
		}
	});
});

function addToGrid(res, data) {	
	fs.writeFile('public/data/data', data, function(err) {
		if(err) { res.send({ error: "Can't write file. " + err + '.' }); return; }
		res.send({
			message: 'Tab has been successfully added to grid.'
		});
	});
}

function replaceAll(str, obj) {
	if(obj.s.length === obj.r.length) {
		for(var i in obj.s) {
			str = str.replace(new RegExp(obj.s[i], 'g'), obj.r[i]);
		}
	}
	return str;
}




app.get('/', routes.index);
app.get('/test', test.show); // test route

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port') + ".");
});
