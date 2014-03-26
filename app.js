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




app.post('/api/option', function(req, res) {
	var data = { "name": "", "desc": "", "url": "", "img": "" };
	fs.readFile('public/data/data', 'utf8', function(err, getData) {
		if(err) { res.send({ error: "Can't read file. " + err + '.'	});	return; }
		var tmp = JSON.parse(getData);
		var tabId = '';
		for(var i in req.body) { tabId = i; }
		for(var tabs in tmp.grid) {
			for(var item in tmp.grid[tabs]) {
				if(item == tabId) {
					data.name = tmp.grid[tabs][item].name;
					data.desc = tmp.grid[tabs][item].desc;
					data.url = tmp.grid[tabs][item].url;
					data.img = tmp.grid[tabs][item].img;
					delete tmp.grid[tabs][tabId];
					break;
				}
			}
		}
		fs.writeFile('public/data/data', replaceAll(JSON.stringify(tmp), { s: [',{}'], r: [''] }), function(err) {
			if(err) { res.send({ error: "Can't write file. " + err + '.' }); return; }			
			if(data.img.split('/')[0] == 'uploads') {
				fs.unlink('public/' + data.img, function(err) {
					if(err) { res.send({ error: "Can't delete file. " + err + '.'	});	return; }
				});
			}
			res.send({
				message: 'Successfully deleted tab ' + data.name + '.'
			});
		});
	});
});

app.post('/api/upload', function(req, res) {
	console.log(Object.keys(req.body).length);
	var name = replaceAll(req.body.tabTextName, { s: ['_'], r: [' '] }),
		url = req.body.tabTextUrl,
		desc = req.body.tabTextDesc,
		file = req.files.tabFile,
		tabId = randomString(5);
	
	if(Object.keys(req.body).length > 3) {
		for(var i in req.body) { tabId = i; }
	}
	
	var extension = file.size != 0 ? '.' + file.name.split('.')[1] : '',
		uploadPath = '/public/uploads/' + tabId + extension;
	console.log(tabId);
	
	fs.readFile('public/data/data', 'utf8', function(err, getData) {
		if(err) { res.send({ error: "Can't read file. " + err + '.'	});	return; }
		var tmp = JSON.parse(replaceAll(getData, { s: [',{}'], r: [''] }));
		if (req.body[tabId] == 'Edit') {
			var data = new Object(), tabName = '', tabImg = '';
			data["name"] = name,
			data["desc"] = desc,
			data["url"] = url,
			data["img"] = file.size != 0 ? "uploads/" + tabId + extension : 'images/default-tab-bg.jpg';
			for(var tabs in tmp.grid) {
				for(var item in tmp.grid[tabs]) {
					if(item == tabId) {
						tabName = tmp.grid[tabs][item].name;
						tabImg = tmp.grid[tabs][item].img;
						tmp.grid[tabs][item].name = data.name;
						tmp.grid[tabs][item].desc = data.desc;
						tmp.grid[tabs][item].url = data.url;
						tmp.grid[tabs][item].img = data.img;
						break;
					}
				}
			}
			if(tabImg.split('/')[0] == 'uploads') {
				fs.unlink('public/' + tabImg, function(err) {
					if(err) { res.send({ error: "Can't delete file. " + err + '.'	});	return; }
				});
			}
			updateGrid(res, JSON.stringify(tmp), 'Successfully updated tab ' + tabName + '.');
		} else {
			var data = new Object(), tab = new Object();
			data["name"] = name,
			data["desc"] = desc,
			data["url"] = url,
			data["img"] = file.size != 0 ? "uploads/" + tabId + extension : 'images/default-tab-bg.jpg',
			tab[tabId] = data;
			tmp.grid.push(tab);
		}
		
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
				
				updateGrid(res, JSON.stringify(tmp), '');
				
				res.send({
					message: 'Tab has been successfully added to grid and file has been uploaded to ' + uploadPath + '.'
				});
			});
		} else if (req.body[tabId] != 'Edit') {
			updateGrid(res, JSON.stringify(tmp), 'Tab has been successfully added to grid.');
		}
	});
});

function updateGrid(res, data, msg) {	
	fs.writeFile('public/data/data', data, function(err) {
		if(err) { res.send({ error: "Can't write file. " + err + '.' }); return; }
		res.send({
			message: msg
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

function randomString(length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var string_length = length > 0 ? length : 5;
	var randomstring = '';
	for (var i = 0; i < string_length; i++) 
	{
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
}





app.get('/', routes.index);
app.get('/test', test.show); // test route

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port') + ".");
});
