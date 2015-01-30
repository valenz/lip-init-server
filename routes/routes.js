var Entities = require('html-entities').AllHtmlEntities
  , methods = require('../classes/methods/methods')
  , RenderObject = require('../classes/render')
  , pageInfo = require('webpage-info')
  , mongoose = require('mongoose')
  , urlparse = require('urlparse')
  , webshot = require('webshot');

var uploadPath = 'public/uploads/';
var entities = new Entities();
var options = {
    screenSize: {
      width: 720,
      height: 405
    },
    shotSize: {
      width: 720,
      height: 405
    },
    phantomConfig: {
      'config': 'config.json'
      //'ignore-ssl-errors': 'true',
      //'output-encoding': 'utf8',
      //'ssl-protocol': 'tlsv1',
      //'web-security': 'false'
    },
    siteType: 'url',
    timeout: 60*1000, // 60 sec
    renderDelay: 1000, // 1 sec
    defaultWhiteBackground: true,
    settings: {
      javascriptEnabled: true,
      XSSAuditingEnabled: true
    },
    // This callback is invoked when a web page was unable to load resource.
    onResourceError: function(resourceError) {
      console.log('ON.RESOURCE.ERROR: Unable to load resource (ID: #'+ resourceError.id +' URL: '+ resourceError.url +')');
      console.log('ON.RESOURCE.ERROR: Error code: '+ resourceError.errorCode +'. Description: '+ resourceError.errorString);
    },
    // This callback is invoked when a resource requested by the page timeout.
    onResourceTimeout: function(request) {
			console.log('ON.RESOURCE.TIMEOUT: Response (ID: #'+ request.id +'): '+ JSON.stringify(request));
    }
  };

/**
 *********************************** GET ***********************************
 */

/**
 * Selects all documents in collection tab, sorted by the field whenCreated
 * in descending order and pass a local variable to the user page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.index = function(req, res) {
	mongoose.model('tab').find({}, null, { sort: { whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
		if(err) return console.error(err);
		mongoose.model('category').find(function(err, category) {
			if(err) return console.error(err);
			var ro = new RenderObject();
			ro.set({
				title: 'Index',
				grid: tab,
				list: category,
				user: req.user,
				info: req.flash('info'),
				error: req.flash('error'),
				success: req.flash('success')
			});
			res.render('index', ro.get());
		});
	});
};

/**
 * Selects all documents in collection tab, sorted by the field whenCreated
 * in descending order and pass a local variable to the user page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.user = function(req, res) {
	mongoose.model('tab').find({}, null, { sort: { whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
		if(err) return console.error(err);
		mongoose.model('category').find(function(err, category) {
			if(err) return console.error(err);
			var ro = new RenderObject();
			ro.set({
				title: req.user.username,
				grid: tab,
				list: category,
				user: req.user,
				info: req.flash('info'),
				error: req.flash('error'),
				success: req.flash('success')
			});
			res.render('sites/user', ro.get());
		});
	});
};

/**
 * Selects all documents in collection tab and account, sorted by the field name
 * in ascending order and pass a local variable to the settings page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.settings = function(req, res) {
	mongoose.model('tab').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, tab) {
		if(err) return console.error(err);
		mongoose.model('account').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, acc) {
			if(err) return console.error(err);
      mongoose.model('category').find(function(err, category) {
        if(err) return console.error(err);
        var ro = new RenderObject();
        ro.set({
          title: 'Settings',
          list: category,
          accs: acc,
          tabs: tab,
          user: req.user,
          info: req.flash('info'),
          error: req.flash('error'),
          success: req.flash('success')
        });
        res.render('sites/settings', ro.get());
      });
		});
	});
};

/**
 * Pass a local variable to the help page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.help = function(req, res) {
	var ro = new RenderObject();
	ro.set({
		title: 'Help',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
	res.render('sites/help', ro.get());
};

/**
 * Pass a local variable to the login form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.login = function(req, res) {
	var ro = new RenderObject();
	ro.set({
		title: 'Login',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
	res.render('forms/login', ro.get());
};

/**
 * Calls the exported function logout in methods
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 */
module.exports.logout = function(req, res) {
	methods.logout(req, res);
	res.redirect('/');
};

/**
 * Pass a local variable to the create_account form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.createAccount = function(req, res) {
	var ro = new RenderObject();
	ro.set({
		title: 'Create Account',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
	res.render('forms/create_account', ro.get());
};

/**
 * Pass a local variable to the update_account form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.updateAccount = function(req, res) {
	var ro = new RenderObject();
	ro.set({
		title: 'Update Account',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
	res.render('forms/update_account', ro.get());
};

/**
 * Selects all documents in collection category and pass a local variable to
 * the create_tab page. Get an array of flash messages by passing the keys to
 * req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.createTab = function(req, res) {
	mongoose.model('category').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, list) {
		if(err) return console.error(err);
		var ro = new RenderObject();
		ro.set({
			title: 'Create Tab',
			list: list,
			user: req.user,
			info: req.flash('info'),
			error: req.flash('error'),
			success: req.flash('success')
		});
		res.render('forms/create_tab', ro.get());
	});
};

/**
 * Pass a local variable to the update_tab form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.updateTab = function(req, res) {
	mongoose.model('category').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, list) {
		if(err) return console.error(err);
		var ro = new RenderObject();
		ro.set({
			title: 'Update Tab',
			list: list,
			query: req.query,
			user: req.user,
			info: req.flash('info'),
			error: req.flash('error'),
			success: req.flash('success')
		});
		res.render('forms/update_tab', ro.get());
	});
};

/**
 * Pass a local variable to the create_category form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.createCategory = function(req, res) {
	var ro = new RenderObject();
	ro.set({
		title: 'Create Category',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
	res.render('forms/create_category', ro.get());
};

/**
 * Pass a local variable to the user_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.userDetails = function(req, res) {
	var ro = new RenderObject();
	ro.set({
		title: 'User Details',
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
	res.render('forms/user_details', ro.get());
};

/**
 * Pass a local variable to the tab_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.tabDetails = function(req, res) {
	var ro = new RenderObject();
	ro.set({
		title: 'Tab Details',
		query: req.query,
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
	res.render('forms/tab_details', ro.get());
};

/**
 * Pass a local variable to the category_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
module.exports.categoryDetails = function(req, res) {
	var ro = new RenderObject();
	ro.set({
		title: 'Category Details',
		query: req.query,
		user: req.user,
		info: req.flash('info'),
		error: req.flash('error'),
		success: req.flash('success')
	});
	res.render('forms/category_details', ro.get());
};

/**
 *********************************** POST ***********************************
 */

/**
 * Sets a flash message by passing the key, followed by the value, to req.flash()
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 */
module.exports.postLogin = function(req, res) {
	console.log('LOGIN: '+ req.user.username +' has been logged in.');
	req.flash('success', 'You are logged in. Welcome, '+req.user.username+'!');
	res.redirect('/user');
};

/**
 * Creates a new object with request parameters from the submitted form name attributes
 * and try to save the object to the collection account as a new document.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.postCreateAccount = function(req, res) {
	// The passport-local-mongoose package automatically takes care of salting and hashing the password.
	var user = new Object({
		username: req.body.username,
		whoCreated: req.user ? req.user.username : req.body.username,
		whenCreated: new Date(),
		whenUpdated: undefined
	});
	var Account = mongoose.model('account');
	if(req.body.password === req.body.confirm) {
		try {
			Account.register(new Account(user), req.body.password, function(err) {
				if(err) {
					req.flash('error', err.message);
					res.redirect('/createaccount');
					return console.error(err);
				} else {
					console.log('CREATE.ACCOUNT: '+ user.username +' has been created successfully.');
					req.flash('success', 'Account has been created successfully.');
					res.redirect('/createaccount');
				}
			});
		} catch(e) {
			console.error(e.stack);
		}
	} else {
		req.flash('info', 'Account could not be created. Passwords did not match.');
		res.redirect('/createaccount');
	}
};

/**
 * Selects all documents in collection account with queried object
 * and try to update the document from the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.postUpdateAccount = function(req, res) {
	var query = new Object({ _id: req.user._id });
	if(req.body.newPassword === req.body.confirm) {
		mongoose.model('account').findOne(query, function(err, doc) {
			if(err) return console.error(err);
			doc.setPassword(req.body.newPassword, function(err, doc) {
				if(err) return console.error(err);
				doc.whenUpdated = new Date();
				try {
					doc.save(function(err, doc) {
						if(err) {
							req.flash('error', err);
							res.redirect('/updateaccount');
							return console.error(err);
						} else {
							console.log('UPDATE.ACCOUNT: '+ doc.username +' was updated successfully.');
							req.flash('success', 'Your new password has been set successfully.');
							res.redirect('/updateaccount');
						}
					});
				} catch(e) {
					console.error(e.stack);
				}
			});
		});
	}
};

/**
 * Selects all documents in collection account with queried object
 * and try to remove the document from the collection.
 * Calls the exported function logout in methods
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.postDeleteAccount = function(req, res) {
	var query = new Object({ _id: req.body.id });
	mongoose.model('account').findOne(query, function(err, doc) {
		if(err) return console.error(err);
		try {
			doc.remove(function(err) {
				if(err) {
					req.flash('error', err);
					res.redirect('/');
					return console.error(err);
				} else {
					console.log('DELETE.ACCOUNT: '+ doc.username +' was deleted successfully.');
					req.flash('success', 'Your Account has been deleted successfully.');
					methods.logout(req, res);
					res.redirect('/');
				}
			});
		} catch(e) {
			console.error(e.stack);
		}
	});
};

/**
 * Creates a new Tab with request parameters from the submitted form name attributes.
 * Opens the given url and loads it to the page and provides the page status to the
 * function ('success' or 'fail'). Evaluates the given function in the
 * context of the web page and try to save the document to the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.postCreateTab = function(req, res) {
	console.log('CREATE.TAB: body request');
	console.log(req.body);
  var url = urlparse(req.body.address).normalize().toString();

  pageInfo.parse(url, function(info) {
    if(info.error) {
      req.flash('error', info.error.toString());
      res.redirect('/createtab');
      return console.error(info.error);
    } else {
      var title = info.title ? entities.decode(info.title) : req.body.address;
      var Tab = mongoose.model('tab');
      var data = new Tab({
        name: req.body.name ? methods.shorter(req.body.name, 42) : methods.shorter(title, 42),
        url: req.body.address,
        title: title,
        icon: info.favicon,
        category: req.body.category,
        check: req.body.check ? true : false,
        whoCreated: req.user.username,
        whenCreated: new Date(),
        whenUpdated: undefined
      });
      console.log('CREATE.TAB: response ' + data);
      try {
        data.save(function(err, doc) {
          if(err) return console.error(err);
          webshot(url, uploadPath+doc._id+'.png', options, function(err) {
            if(err) return console.error(err);
            var query = new Object({ name: req.body.category });
            mongoose.model('category').findOne(query, function(err, cat) {
              if(err) {
                req.flash('error', err);
                res.redirect('/createtab');
                return console.error(err);
              }
              var data = methods.paste(doc._id, cat);
              if(data) {
                data.save(function(err, doc) {
                  if(err) {
                    req.flash('error', err);
                    res.redirect('/createtab');
                    return console.error(err);
                  }
                });
              }
            });
            console.log('CREATE.TAB: "'+ doc.name +'" ('+ doc._id +') has been created.');
            req.flash('success', 'Tab has been created successfully.');
            res.redirect('/createtab');
          });
        });
      } catch(e) {
        console.error(e.stack);
      }
    }
  }, 60*1000); // 60 sec timeout
};

/**
 * Updated the given Tab with request parameters from the submitted form name
 * attributes.
 * Opens the given url and loads it to the page and provides the page status to the
 * function ('success' or 'fail'). Evaluates the given function in the
 * context of the web page and try to save the document to the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.postUpdateTab = function(req, res) {
	console.log('UPDATE.TAB: body request');
	console.log(req.body);

  var query = new Object({ _id: req.body.id });
	mongoose.model('tab').findOne(query, function(err, doc) {
		if(err) return console.error(err);

    pageInfo.parse(req.body.address, function(info) {
      if(info.error) {
        req.flash('error', info.error.toString());
        res.redirect('/');
        return console.error(info.error);
      } else {

        var query = new Object({ name: doc.category });
        mongoose.model('category').findOne(query, function(err, cat) {
          if(err) return console.error(err);
          var data = methods.detach(doc._id, cat);
          if(data) {
            data.save(function(err, doc) {
              if(err) {
                req.flash('error', err);
                res.redirect('/updatetab');
                return console.error(err);
              }
            });
          }
        });

        if(!req.body.check) {
          var query = new Object({ name: req.body.category });
          mongoose.model('category').findOne(query, function(err, cat) {
            if(err) return console.error(err);
            var data = methods.paste(doc._id, cat);
            if(data) {
              data.save(function(err, doc) {
                if(err) {
                  req.flash('error', err);
                  res.redirect('/updatetab');
                  return console.error(err);
                }
              });
            }
          });
        }

        var title = info.title ? entities.decode(info.title) : req.body.address;
        doc.name = req.body.name ? methods.shorter(req.body.name, 42) : methods.shorter(title, 42);
        doc.url = req.body.address;
        doc.title = title;
        doc.icon = info.favicon;
        doc.category = req.body.category;
        doc.check = req.body.check ? true : false;
        doc.whoCreated = doc.whoCreated;
        doc.whoUpdated = req.user.username;
        doc.whenCreated = doc.whenCreated;
        doc.whenUpdated = new Date();
        doc.__v = doc.__v + 1;

        console.log('UPDATE.TAB: response ' + doc);

        try {
          doc.save(function(err, doc) {
            if(err) return console.error(err);
            webshot(req.body.address, uploadPath+doc._id+'.png', options, function(err) {
              if(err) {
                req.flash('error', err);
                res.redirect('/updatetab');
                return console.error(err);
              }
              console.log('UPDATE.TAB: "'+ doc.name +'" ('+ doc._id +') has been updated.');
              req.flash('success', 'Tab has been updated successfully.');
              req.body.check ? res.redirect('/user') : res.redirect('/');
            });
          });
        } catch(e) {
          console.error(e.stack);
        }
      }
    }, 60*1000); // 60 sec timeout
	});
};

/**
 * Selects all documents in collection tab with queried object
 * and try to remove the document from the collection.
 * Calls the exported function clear in methods
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.postDeleteTab = function(req, res) {
	var query = new Object({ _id: req.body.id });
	mongoose.model('tab').findOne(query, function(err, tab) {
		if(err) return console.error(err);
		query = new Object({ name: tab.category });
		mongoose.model('category').findOne(query, function(err, cat) {
			if(err) return console.error(err);
			try {
          var data = methods.detach(req.body.id, cat);
				if(data) {
					data.save(function(err, doc) {
						if(err) {
							req.flash('error', err);
							res.redirect('back');
							return console.error(err);
						}
					});
				}
				tab.remove(function(err, doc) {
					if(err) {
						req.flash('error', err);
						res.redirect('back');
						return console.error(err);
					} else {
						methods.clear(req);
						console.log('DELETE.TAB: '+ doc +' was deleted successfully.');
						req.flash('success', 'Tab has been deleted successfully.');
						res.redirect('back');
					}
				});
			} catch(e) {
				console.error(e.stack);
			}
		});
	});
};

/**
 * Creates a new Category with request parameters from the submitted form name
 * attributes and try to save the object to the collection category list.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
module.exports.postCreateCategory = function(req, res) {
	var category = req.body.categoryname;
	category = category.substr(0, 1).toUpperCase() + category.substr(1, category.length);
	var Category = mongoose.model('category');
	var data = new Category({
		name: category,
		list: new Array()
	});
	try {
		data.save(function(err, doc) {
			if(err) {
				req.flash('error', err);
				res.redirect('/createcategory');
				return console.error(err);
			} else {
				console.log('CREATE.CATEGORY: "'+ doc.name +'" ('+ doc._id +') has been created.');
				req.flash('success', 'Category has been created successfully.');
				res.redirect('/createcategory');
			}
		});
	} catch(e) {
		console.error(e.stack);
	}
};

/**
 * Simple route middleware to ensure user is authenticated.
 * Use this route middleware on any resource that needs to be protected.  If
 * the request is authenticated (typically via a persistent login session),
 * the request will proceed.  Otherwise, the user will be redirected to the
 * login form page.
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {return} next
 */
module.exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}
