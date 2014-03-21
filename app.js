
/**
 * Module dependencies.
 */

var express = require('express')
  , formidable = require('formidable')
  , routes = require('./routes')
  , test = require('./routes/test') // test route
  , http = require('http')
  , mv = require('mv')
  , path = require('path');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 8080);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, '/public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/test', test.show); // test route

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port') + ".");
});

app.post('/api/photos', function(req, res) {

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		
		if(err) {
			console.log(err);
		} else {
			if(files.userPhoto) {
				var fileExt = '.' + files.userPhoto.name.split('.')[1];
				var serverPath = fields.userPhotoName ? '/uploads/' + fields.userPhotoName + fileExt : '/uploads/' + files.userPhoto.name;
				
				// mv('source/dir', 'dest/dir', function(err) {});
				// it first created all the necessary directories (mkdirp: true), and then
  				// tried fs.rename, then falls back to using ncp to copy the dir
  				// to dest and then rimraf to remove the source dir
  				// If 'dest/file' exists (clobber: false), an error is returned with err.code === 'EEXIST'.
				mv(files.userPhoto.path, __dirname + '/public' + serverPath, {mkdirp:true, clobber: false}, function(err) {
					if(err) {
						res.send({
							error: 'Something went wrong! ' + err
						});
						return false;
					}
			 
					res.send({
						path: serverPath
					});
				});
			}
		}
	});
});
