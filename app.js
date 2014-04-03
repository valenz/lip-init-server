/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , test = require('./routes/test') // test route
  , phantom = require('phantom'), _page
  , http = require('http')
  , fs = require('fs')
  , path = require('path')
  , app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 9090);
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
	console.log('delete >');
	console.log(req.body);
	var data = { "name": "", "desc": "", "url": "", "img": "" };
	fs.readFile('public/data/data.json', 'utf8', function(err, getData) {
		if(err) {res.send({error: "Can't read file. " + err + '.'}); return;}
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
		
		fs.writeFile('public/data/data.json', replaceAll(JSON.stringify(tmp), { s: [',{}','{},','{}'], r: ['','',''] }), function(err) {
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
	var url = req.body.tabTextUrl,
		str1 = url.split('/')[2].split('.')[0],
		str2 = str1 == 'www' ? url.split('/')[2].split('.')[1] : '',
		name = req.body.tabTextName != '' ? req.body.tabTextName.charAt(0).toUpperCase()+req.body.tabTextName.slice(1) : str1 == 'www' ? str2.charAt(0).toUpperCase()+str2.slice(1) : str1.charAt(0).toUpperCase()+str1.slice(1),
		name = name.length > 20 ? name.substring(0, 20)+'...' : name;
		desc = req.body.tabTextDesc,
		tabId = '';
	
	if(Object.keys(req.body).length > 2) {
		for(var i in req.body) { tabId = i; }
	} else { tabId = randomString(5); }
		
	console.log('upload >');
	console.log(req.body);
	
	var filePath = 'public/data/data.json',
		imageDefaultPath = 'images/default-tab-bg.jpg',
		imagePath = 'uploads/'+tabId+'.png',
		uploadPath = 'public/'+imagePath;
	
	fs.readFile(filePath, 'utf8', function(err, getData) {
		if(err) {res.send({error: "Can't read file. " + err + '.'}); return;}
		var tmp = JSON.parse(replaceAll(getData, { s: [',{}'], r: [''] }));
		
		_page.open(url, function(status) {	
			console.log('url_status > '+status);
			if (req.body[tabId] == 'Edit') {
				var data = new Object(), tabName = '', tabImg = '';
				data["name"] = name,
				data["desc"] = desc,
				data["url"] = url,
				data["img"] = url != '' && status == 'success' ? imagePath : imageDefaultPath;
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
						if(err) {res.send({error: "Can't delete file. " + err + '.'}); return;}
					});
				}
				updateGrid(res, filePath, JSON.stringify(tmp), 'Successfully updated tab ' + tabName + '.');
			} else {
				var data = new Object(), tab = new Object();
				data["name"] = name,
				data["desc"] = desc,
				data["url"] = url,
				data["img"] = url != '' && status == 'success' ? imagePath : imageDefaultPath,
				tab[tabId] = data;
				tmp.grid.push(tab);
				updateGrid(res, filePath, JSON.stringify(tmp), 'Tab has been successfully added to grid.');
			}
			
			if(status == 'success') {
				_page.set('viewportSize', {width:1024,height:576});
				_page.set('clipRect', {top:0,left:0,width:1024,height:576});
				_page.render(uploadPath);
			}
		});
	});
});

function updateGrid(res, filePath, data, msg) {	
	fs.writeFile(filePath, data, function(err) {
		if(err) {res.send({error: "Can't write file. " + err + '.'}); return;}
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

phantom.create('--web-security=no', '--ignore-ssl-errors=yes', function(ph) {
	ph.createPage(function(page) {
		_page = page;
		console.log('Phantom bridge initiated and page created.');
	});
});
