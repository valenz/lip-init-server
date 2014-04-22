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
  , mysql = require('mysql')
  , connection = mysql.createConnection({host:'localhost',user:'bob',password:'secret',database:'test'})
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
	
	fs.readFile('public/data/data.json', 'utf8', function(err, getData) {
		if(err) {res.send({error: 'Error No: ' + err.errno + "; Can't read file. " + err + '.'}); return;}
		var tmp = JSON.parse(getData);
		var data = new Object();
		data["name"] = '', data["img"] = '', tabId = '';
		for(var i in req.body) { tabId = i; }
		for(var tabs in tmp.grid) {
			for(var item in tmp.grid[tabs]) {
				if(item == tabId) {
					data.name = tmp.grid[tabs][item].name;
					data.img = tmp.grid[tabs][item].img;
					delete tmp.grid[tabs][tabId];
					break;
				}
			}
		}
		
		fs.writeFile('public/data/data.json', replaceAll(JSON.stringify(tmp), { s: [',{}','{},','{}'], r: ['','',''] }), function(err) {
			if(err) { res.send({ error: 'Error No: ' + err.errno + "; Can't write file. " + err + '.' }); return; }
			fs.exists('public/' + data.img, function(exists) {
				if(exists) {
					fs.unlink('public/' + data.img, function(err) {
						if(err) { res.send({ error: 'Error No: ' + err.errno + "; Can't delete file. " + err + '.'	});	return; }
					});
				}
			});
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
		name = name.length > 17 ? name.substring(0, 17)+'...' : name;
		tabId = req.body.edit ? req.body.edit : randomString(9);
	
	var filePath = 'public/data/data.json',
		imagePath = 'uploads/'+tabId+'.png',
		uploadPath = 'public/'+imagePath;
	
	console.log(req.body);
	
	fs.readFile(filePath, 'utf8', function(err, getData) {
		if(err) {res.send({error: 'Error No: ' + err.errno + "; Can't read file. " + err + '.'}); return;}
		var tmp = JSON.parse(getData), change = false;
		
		/** Edit tab */
		if (req.body.edit) {
			_page.open(url, function(status) {
				/** Url is valid */
				if(status == 'success') {
					/** Get title and icon from a webpage */
					_page.evaluate(function() {
						var data = new Object();
						data["title"] = document.title;
						var icon = document.getElementsByTagName('link');
						for(var i in icon) {
							try {
								if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
									data["icon"] = icon[i].href;
									return data;
								}
							} catch(e) {
								data["icon"] = 'https://plus.google.com/_/favicon?domain_url='+window.location.origin;
								return data;
							}
						}
					}, function(result) {
				
						console.log('edited > '+tabId);
						console.log('url_status > '+status);
						console.log(result);
						
						var data = new Object(), tabName = '', tabImg = '';
						data["name"] = req.body.tabTextName == '' ? result.title.length > 17 ? result.title.substring(0, 17)+'...' : result.title : name,
						data["url"] = url,
						data["title"] = result.title,
						data["icon"] = result.icon,
						data["img"] = url != '' ? imagePath : '';
			
						for(var tabs in tmp.grid) {
							for(var item in tmp.grid[tabs]) {
								if(item == tabId) {
									tabName = tmp.grid[tabs][item].name;
									tabImg = tmp.grid[tabs][item].img;
									tmp.grid[tabs][item].name = data.name;
									tmp.grid[tabs][item].url = data.url;
									tmp.grid[tabs][item].title = data.title;
									tmp.grid[tabs][item].icon = data.icon;
									tmp.grid[tabs][item].img = data.img;
									break;
								}
							}
						}
						
						fs.exists('public/' + tabImg, function(exists) {
							if(exists) {
								fs.unlink('public/' + tabImg, function(err) {
									if(err) {res.send({error: 'Error No: ' + err.errno + "; Can't delete file. " + err + '.'}); return;}
								});
							}
							
							_page.set('viewportSize', {width:960,height:540});
							_page.set('clipRect', {top:0,left:0,width:960,height:540});
							_page.render(uploadPath);
						});
						
						updateGrid(res, filePath, JSON.stringify(tmp), 'Successfully updated tab ' + tabName + '.');
					}, "title");
				/** Url is not valid */
				} else {
				
					console.log('edited > '+tabId);
					console.log('url_status > '+status);
					
					var data = new Object(), tabName = '', tabImg = '';
					data["name"] = name,
					data["url"] = url,
					data["title"] = '',
					data["icon"] = '',
					data["img"] = url != '' ? imagePath : '';
		
					for(var tabs in tmp.grid) {
						for(var item in tmp.grid[tabs]) {
							if(item == tabId) {
								if(tmp.grid[tabs][item].url != data.url) {change = true;}
								tabName = tmp.grid[tabs][item].name;
								tabImg = tmp.grid[tabs][item].img;
								tmp.grid[tabs][item].name = data.name;
								tmp.grid[tabs][item].url = data.url;
								tmp.grid[tabs][item].title = data.title;
								tmp.grid[tabs][item].icon = data.icon;
								tmp.grid[tabs][item].img = data.img;
								break;
							}
						}
					}
						
					fs.exists('public/' + tabImg, function(exists) {
						if(exists) {
							fs.unlink('public/' + tabImg, function(err) {
								if(err) {res.send({error: 'Error No: ' + err.errno + "; Can't delete file. " + err + '.'}); return;}
							});
						}
						
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath);
					});
					
					updateGrid(res, filePath, JSON.stringify(tmp), 'Successfully updated tab ' + tabName + '.');
				}
			});
		/** Upload tab */
		} else {
			_page.open(url, function(status) {
				/** Url is valid */
				if(status == 'success') {
					/** Get title and icon from a webpage */
					_page.evaluate(function() {
						var data = new Object();
						data["title"] = document.title;
						var icon = document.getElementsByTagName('link');
						for(var i in icon) {
							try {
								if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
									data["icon"] = icon[i].href;
									return data;
								}
							} catch(e) {
								data["icon"] = 'https://plus.google.com/_/favicon?domain_url='+window.location.origin;
								return data;
							}
						}
					}, function(result) {
				
						console.log('uploaded > '+tabId);
						console.log('url_status > '+status);
						console.log(result);
						
						var data = new Object(), tab = new Object();
						data["name"] = req.body.tabTextName == '' ? result.title.length > 17 ? result.title.substring(0, 17)+'...' : result.title : name,
						data["url"] = url,
						data["title"] = result.title,
						data["icon"] = result.icon,
						data["img"] = url != '' ? imagePath : '',
						tab[tabId] = data;
						tmp.grid.push(tab);
						updateGrid(res, filePath, JSON.stringify(tmp), 'Tab has been successfully added to grid.');
						
						_page.set('viewportSize', {width:960,height:540});
						_page.set('clipRect', {top:0,left:0,width:960,height:540});
						_page.render(uploadPath);
					}, "title");
				/** Url is not valid */
				} else {
					console.log('uploaded > '+tabId);
					console.log('url_status > '+status);
					
					var data = new Object(), tab = new Object();
					data["name"] = name,
					data["url"] = url,
					data["title"] = '',
					data["icon"] = '',
					data["img"] = url != '' ? imagePath : '',
					tab[tabId] = data;
					tmp.grid.push(tab);
					updateGrid(res, filePath, JSON.stringify(tmp), 'Tab has been successfully added to grid.');
				}
			});
		}
	});
});

function updateGrid(res, filePath, data, msg) {	
	fs.writeFile(filePath, data, function(err) {
		if(err) {res.send({error: 'Error No: ' + err.errno + "; Can't write file. " + err + '.'}); return;}
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

connection.connect();
connection.query('SELECT * FROM tabs', function(err, result) {
	if(err) throw err;
	
	console.log(result);
});
connection.end();

phantom.create('--web-security=no', '--ignore-ssl-errors=yes', function(ph) {
	ph.createPage(function(page) {
		_page = page;
		console.log('Phantom bridge initiated and page created.');
		/*page.open('https://www.amazon.com', function(status) {
			page.evaluate(function() {
				var data = new Object();
				data["title"] = document.title;
				var icon = document.getElementsByTagName('link');
				for(var i in icon) {
					if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
						data["icon"] = icon[i].href;
						return data;
					}
				}
			}, function(result) {
				console.log(result);
			}, "title");
		});*/
	});
});
