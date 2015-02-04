var Entities = require('html-entities').AllHtmlEntities
  , methods = require('../classes/methods/methods')
  , RenderObject = require('../classes/render')
  , phantom = require('phantom')
  , mongoose = require('mongoose')
  , urlparse = require('urlparse');

var uploadPath = 'public/uploads/';
var entities = new Entities();

/**
 ********************************* EXPORTS *********************************
 */

module.exports.login = login;
module.exports.logout = logout;
module.exports.index = index;
module.exports.account = account;
module.exports.settings = settings;
module.exports.help = help;
module.exports.accountCreate = accountCreate;
module.exports.accountUpdate = accountUpdate;
module.exports.accountDetails = accountDetails;
module.exports.categoryCreate = categoryCreate;
module.exports.categoryUpdate = categoryUpdate;
module.exports.categoryDetails = categoryDetails;
module.exports.tabCreate = tabCreate;
module.exports.tabUpdate = tabUpdate;
module.exports.tabDetails = tabDetails;

module.exports.postLogin = postLogin;
module.exports.postAccountCreate = postAccountCreate;
module.exports.postAccountUpdate = postAccountUpdate;
module.exports.postAccountDelete = postAccountDelete;
module.exports.postCategoryCreate = postCategoryCreate;
module.exports.postCategoryUpdate = postCategoryUpdate;
module.exports.postCategoryDelete = postCategoryDelete;
module.exports.postTabCreate = postTabCreate;
module.exports.postTabUpdate = postTabUpdate;
module.exports.postTabDelete = postTabDelete;
module.exports.postConfirm = postConfirm;
module.exports.ensureAuthenticated = ensureAuthenticated;

/**
 ******************************* GET METHODS *******************************
 */

/**
 * Pass a local variable to the login form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function login(req, res) {
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
function logout(req, res) {
  methods.logout(req, res);
  res.redirect('/');
};

/**
 * Selects all documents in collection tab, sorted by the field whenCreated
 * in descending order and pass a local variable to the user page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function index(req, res) {
  mongoose.model('tab').find({}, null, { sort: { whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
    if(err) return console.error(err);
    mongoose.model('category').find({}, null, { sort: { name: -1 }, skip: 0, limit: 0 }, function(err, category) {
      if(err) return console.error(err);
      var ro = new RenderObject();
      ro.set({
        title: 'Index',
        grid: tab,
        list: category,
        user: req.user,
        admintabs: methods.getAdminTabs(tab),
        assigned: methods.getAssignedTabs(category),
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
function account(req, res) {
  mongoose.model('tab').find({}, null, { sort: { whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
    if(err) return console.error(err);
    mongoose.model('category').find({}, null, { sort: { name: -1 }, skip: 0, limit: 0 }, function(err, category) {
      if(err) return console.error(err);
      var ro = new RenderObject();
      ro.set({
        title: req.user.username,
        grid: tab,
        list: category,
        user: req.user,
        admintabs: methods.getAdminTabs(tab),
        info: req.flash('info'),
        error: req.flash('error'),
        success: req.flash('success')
      });
      res.render('sites/account', ro.get());
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
function settings(req, res) {
  mongoose.model('tab').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, tab) {
    if(err) return console.error(err);
    mongoose.model('account').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, account) {
      if(err) return console.error(err);
      mongoose.model('category').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, category) {
        if(err) return console.error(err);
        var ro = new RenderObject();
        ro.set({
          title: 'Settings',
          list: category,
          accs: account,
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
function help(req, res) {
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
 * Pass a local variable to the account_create form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function accountCreate(req, res) {
  var ro = new RenderObject();
  ro.set({
    title: 'Create Account',
    user: req.user,
    info: req.flash('info'),
    error: req.flash('error'),
    success: req.flash('success')
  });
  res.render('forms/account_create', ro.get());
};

/**
 * Pass a local variable to the account_update form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function accountUpdate(req, res) {
  var ro = new RenderObject();
  ro.set({
    title: 'Update Account',
    user: req.user,
    info: req.flash('info'),
    error: req.flash('error'),
    success: req.flash('success')
  });
  res.render('forms/account_update', ro.get());
};

/**
 * Pass a local variable to the user_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function accountDetails(req, res) {
  var ro = new RenderObject();
  ro.set({
    title: 'User Details',
    user: req.user,
    info: req.flash('info'),
    error: req.flash('error'),
    success: req.flash('success')
  });
  res.render('forms/account_details', ro.get());
};

/**
 * Pass a local variable to the category_create form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function categoryCreate(req, res) {
  var ro = new RenderObject();
  ro.set({
    title: 'Create Category',
    user: req.user,
    info: req.flash('info'),
    error: req.flash('error'),
    success: req.flash('success')
  });
  res.render('forms/category_create', ro.get());
};

/**
 * Pass a local variable to the category_update form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function categoryUpdate(req, res) {
  var ro = new RenderObject();
  ro.set({
    title: 'Update Category',
    query: req.query,
    user: req.user,
    info: req.flash('info'),
    error: req.flash('error'),
    success: req.flash('success')
  });
  res.render('forms/category_update', ro.get());
};

/**
 * Pass a local variable to the category_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function categoryDetails(req, res) {
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
 * Selects all documents in collection category and pass a local variable to
 * the tab_create page. Get an array of flash messages by passing the keys to
 * req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function tabCreate(req, res) {
  mongoose.model('category').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, category) {
    if(err) return console.error(err);
    var ro = new RenderObject();
    ro.set({
      title: 'Create Tab',
      list: category,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('forms/tab_create', ro.get());
  });
};

/**
 * Pass a local variable to the tab_update form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function tabUpdate(req, res) {
  mongoose.model('category').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, category) {
    if(err) return console.error(err);
    var ro = new RenderObject();
    ro.set({
      title: 'Update Tab',
      list: category,
      query: req.query,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('forms/tab_update', ro.get());
  });
};

/**
 * Pass a local variable to the tab_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function tabDetails(req, res) {
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
 ******************************* POST METHODS *******************************
 */

/**
 * Sets a flash message by passing the key, followed by the value, to req.flash()
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 */
function postLogin(req, res) {
  console.log('LOGIN: '+ req.user.username +' has been logged in.');
  req.flash('success', 'You are logged in. Welcome, '+req.user.username+'!');
  res.redirect('/account');
};

/**
 * Creates a new object with request parameters from the submitted form name attributes
 * and try to save the object to the collection account as a new document.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postAccountCreate(req, res) {
  console.log('CREATE.ACCOUNT: body request');
  console.log(req.body.username);
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
      Account.register(new Account(user), req.body.password, function(err, doc) {
        if(err) {
          req.flash('error', err.message);
          res.redirect('create');
          return console.error(err);
        } else {
          console.log('CREATE.ACCOUNT: '+ doc.username +' has been created successfully.');
          req.flash('success', 'Account has been created successfully.');
          res.redirect('/settings');
        }
      });
    } catch(e) {
      console.error(e.stack);
    }
  } else {
    req.flash('info', 'Account could not be created. Passwords did not match.');
    res.redirect('create');
  }
};

/**
 * Selects all documents in collection account with queried object
 * and try to update the document from the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postAccountUpdate(req, res) {
  console.log('UPDATE.ACCOUNT: body request');
  console.log(req.body);
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
              res.redirect('update');
              return console.error(err);
            } else {
              console.log('UPDATE.ACCOUNT: '+ doc.username +' was updated successfully.');
              req.flash('success', 'Password has been set successfully.');
              res.redirect('/settings');
            }
          });
        } catch(e) {
          console.error(e.stack);
        }
      });
    });
  } else {
    console.log('UPDATE.ACCOUNT: Account could not be updated. Passwords did not match.');
    req.flash('info', 'Account could not be updated. Passwords did not match.');
    res.redirect('update');
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
function postAccountDelete(req, res) {
  console.log('DELETE.ACCOUNT: body request');
  console.log(req.body);
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
          req.flash('success', 'Account has been deleted successfully.');
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
 * Creates a new Category with request parameters from the submitted form name
 * attributes and try to save the object to the collection category list.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postCategoryCreate(req, res) {
  console.log('CREATE.CATEGORY: body request');
  console.log(req.body);
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
        req.flash('error', err.toString());
        res.redirect('create');
        return console.error(err);
      } else {
        console.log('CREATE.CATEGORY: "'+ doc.name +'" ('+ doc._id +') has been created.');
        req.flash('success', 'Category "'+ doc.name +'" has been created successfully.');
        res.redirect('/settings');
      }
    });
  } catch(e) {
    console.error(e.stack);
  }
};

/**
 * Selects all documents in collection category with queried object,
 * updated the category of all associated tabs and
 * try to save the new document from the collection.
 * Given category must be different from the old one.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postCategoryUpdate(req, res) {
  console.log('UPDATE.CATEGORY: body request');
  console.log(req.body);
  var query = new Object({ _id: req.body.id });
  mongoose.model('category').findOne(query, function(err, cat) {
    if(err) return console.error(err);
    var category = req.body.categoryname;
    category = category.substr(0, 1).toUpperCase() + category.substr(1, category.length);
    if(category && cat.name !== category) {
      cat.name = category;
      try {
        cat.save(function(err, doc) {
          if(err) {
            req.flash('error', err.toString());
            res.redirect('/settings');
            return console.error(err);
          } else {
            console.log('UPDATED.CATEGORY: "'+ doc.name +'" ('+ doc._id +') has been updated.');
            req.flash('success', 'Category "'+ doc.name +'" has been updated successfully.');
            res.redirect('/settings');
          }
        });
      } catch(e) {
        console.error(e.stack);
      }
      for(var i = 0; i < cat.list.length; i++) {
        query = new Object({ _id: cat.list[i] });
        mongoose.model('tab').findOne(query, function(err, tab) {
          if(err) return console.error(err);
          tab.category = category;
          try {
            tab.save(function(err, doc) {
              if(err) {
                req.flash('error', err);
                res.redirect('/settings');
                return console.error(err);
              }
            });
          } catch(e) {
            console.error(e.stack);
          }
        });
      }
    } else {
      console.log('UPDATED.CATEGORY: "'+ cat.name +'" ('+ cat._id +') still same. Nothing updated.');
      req.flash('info', 'Category "'+ cat.name +'" still same. Nothing updated. Please choose a different name.');
      res.redirect('/settings');
    }
  });
};

/**
 * Selects all documents in collection category with queried object,
 * removes the category of all associated tabs and
 * try to remove the document from the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postCategoryDelete(req, res) {
  console.log('DELETE.CATEGORY: body request');
  console.log(req.body);
  var query = new Object({ _id: req.body.id });
  mongoose.model('category').findOne(query, function(err, cat) {
    if(err) return console.error(err);
    for(var i = 0; i < cat.list.length; i++) {
      query = new Object({ _id: cat.list[i] });
      mongoose.model('tab').findOne(query, function(err, tab) {
        if(err) return console.error(err);
        tab.category = undefined;
        try {
          tab.save(function(err, doc) {
            if(err) {
              req.flash('error', err);
              res.redirect('/settings');
              return console.error(err);
            }
          });
        } catch(e) {
          console.error(e.stack);
        }
      });
    }
    try {
      cat.remove(function(err, doc) {
        if(err) {
          req.flash('error', err.toString());
          res.redirect('/settings');
          return console.error(err);
        } else {
          console.log('DELETE.CATEGORY: '+ cat.name +' has been deleted.');
          req.flash('success', 'Category "'+ cat.name +'" has been deleted successfully.');
          res.redirect('/settings');
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
function postTabCreate(req, res) {
  console.log('CREATE.TAB: body request');
  console.log(req.body);
  var url = urlparse(req.body.address).normalize().toString();
  phantom.create('--ignore-ssl-errors=true', '--ssl-protocol=any', '--web-security=false', '--output-encoding=utf8', function (ph) {
    ph.createPage(function (page) {
      console.log('PHANTOM.PROCESS.PID:', ph.process.pid);
      page.set('settings.javascriptEnabled', true);
      page.set('settings.resourceTimeout', 30 * 1000); // timeoute 30 seconds
      // defines the rectangular area of the web page to be rasterized when page.render is invoked
      page.set('clipRect', { top: 0, left: 0, width: 960, height: 540});
      // sets the size of the viewport for the layout process
      page.set('viewportSize', { width: 960, height: 540 });
      // This callback is invoked when a resource requested by the page timeout.
      page.set('onResourceTimeout', function(request) {
        console.log('ON.RESOURCE.TIMEOUT: Response (ID: #'+ request.id +'): '+ JSON.stringify(request));
      });
      // This callback is invoked when a web page was unable to load resource.
      page.set('onResourceError', function(resourceError) {
        console.log('ON.RESOURCE.ERROR: Unable to load resource (ID: #'+ resourceError.id +' URL: '+ resourceError.url +')');
        console.log('ON.RESOURCE.ERROR: Error code: '+ resourceError.errorCode +'. Description: '+ resourceError.errorString);
      });
      // This callback is invoked when there is a JavaScript confirm on the web page.
      page.set('onConfirm', function(msg) {
        console.log('ON.CONFIRM: '+ msg);
        return false; // true === pressing the OK button, false === pressing the Cancel button
      });
      /*// This callback is invoked when the page requests a resource.
      page.set('onResourceRequested', function(requestData, networkRequest) {
        console.log('ON.RESOURCE.REQUESTED: Request (ID: #'+ requestData.id +'): '+ JSON.stringify(requestData));
      });
      // This callback is invoked when a resource requested by the page is received (for every chuck if supported).
      page.set('onResourceReceived', function(response) {
        console.log('ON.RESOURCE.RECEIVED: Response (ID: #'+ response.id +', STAGE: "'+ response.stage +'"): '+ JSON.stringify(response));
      });
      // This callback is invoked when there is a JavaScript console message on the web page.
      page.set('onConsoleMessage', function(msg, lineNum, sourceId) {
        console.log('ON.CONSOLE.MESSAGE: '+ msg +' (from line #'+ lineNum +' in "'+ sourceId +'")');
      });*/
      page.open(req.body.address, function (status) {
        console.log("URL-STATUS: ", status);
        page.evaluate(function () {
          var info = new Object();
          document.body.bgColor = '#F6F6F6';
          info['title'] = document.title ? document.title : undefined;
          var icon = document.getElementsByTagName('link');
          for(var i in icon) {
            try {
              if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
                info['favicon'] = icon[i].href;
                return info;
              }
            } catch(e) {
              info['favicon'] = 'https://plus.google.com/_/favicon?domain_url='+ window.location.origin;
              console.error(e.stack);
              return info;
            }
          }
        }, function (info) {
          var title = info.title ? entities.decode(info.title) : url;
          var Tab = mongoose.model('tab');
          var data = new Tab({
            name: req.body.name ? methods.shorter(req.body.name, 42) : methods.shorter(title, 42),
            url: req.body.address,
            title: info.title,
            icon: info ? info.favicon : undefined,
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
                var query = new Object({ name: req.body.category });
                mongoose.model('category').findOne(query, function(err, cat) {
                  if(err) {
                    req.flash('error', err);
                    res.redirect('create');
                    return console.error(err);
                  }
                  var data = methods.paste(doc._id, cat);
                  if(data) {
                    data.save(function(err, doc) {
                      if(err) {
                        req.flash('error', err);
                        res.redirect('create');
                        return console.error(err);
                      }
                    });
                  }
                });
                // Renders the web page to an image buffer and saves it as the specified filename.
                page.render(uploadPath+doc._id +'.png');
                console.log('CREATE.TAB: "'+ doc.name +'" ('+ doc._id +') has been created.');
                req.flash('success', 'Tab has been created successfully.');
                res.redirect('create');
                ph.exit();
            });
          } catch(e) {
            console.error(e.stack);
          }
        });
      });
    });
  });
};

/**
 * Updated the given Tab with request parameters from the submitted form name
 * attributes.
 * Opens the given url, loads it to the page and provides the page status to the
 * function ('success' or 'fail'). Evaluates the given function in the
 * context of the web page and try to save the document to the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postTabUpdate(req, res) {
  console.log('UPDATE.TAB: body request');
  console.log(req.body);
  var url = urlparse(req.body.address).normalize().toString();
  var query = new Object({ _id: req.body.id });
  mongoose.model('tab').findOne(query, function(err, doc) {
    if(err) return console.error(err);
    var oldAddress = doc.url;
    phantom.create('--ignore-ssl-errors=true', '--ssl-protocol=any', '--web-security=false', '--output-encoding=utf8', function (ph) {
      ph.createPage(function (page) {
        console.log('PHANTOM.PROCESS.PID:', ph.process.pid);
        page.set('settings.javascriptEnabled', true);
        page.set('settings.resourceTimeout', 30 * 1000); // timeoute 30 seconds
        // defines the rectangular area of the web page to be rasterized when page.render is invoked
        page.set('clipRect', { top: 0, left: 0, width: 960, height: 540});
        // sets the size of the viewport for the layout process
        page.set('viewportSize', { width: 960, height: 540 });
        // This callback is invoked when a resource requested by the page timeout.
        page.set('onResourceTimeout', function(request) {
          console.log('ON.RESOURCE.TIMEOUT: Response (ID: #'+ request.id +'): '+ JSON.stringify(request));
        });
        // This callback is invoked when a web page was unable to load resource.
        page.set('onResourceError', function(resourceError) {
          console.log('ON.RESOURCE.ERROR: Unable to load resource (ID: #'+ resourceError.id +' URL: '+ resourceError.url +')');
          console.log('ON.RESOURCE.ERROR: Error code: '+ resourceError.errorCode +'. Description: '+ resourceError.errorString);
        });
        // This callback is invoked when there is a JavaScript confirm on the web page.
        page.set('onConfirm', function(msg) {
          console.log('ON.CONFIRM: '+ msg);
          return false; // true === pressing the OK button, false === pressing the Cancel button
        });
        /*// This callback is invoked when the page requests a resource.
        page.set('onResourceRequested', function(requestData, networkRequest) {
          console.log('ON.RESOURCE.REQUESTED: Request (ID: #'+ requestData.id +'): '+ JSON.stringify(requestData));
        });
        // This callback is invoked when a resource requested by the page is received (for every chuck if supported).
        page.set('onResourceReceived', function(response) {
          console.log('ON.RESOURCE.RECEIVED: Response (ID: #'+ response.id +', STAGE: "'+ response.stage +'"): '+ JSON.stringify(response));
        });
        // This callback is invoked when there is a JavaScript console message on the web page.
        page.set('onConsoleMessage', function(msg, lineNum, sourceId) {
          console.log('ON.CONSOLE.MESSAGE: '+ msg +' (from line #'+ lineNum +' in "'+ sourceId +'")');
        });*/
        page.open(req.body.address, function (status) {
          console.log("URL-STATUS: ", status);
          page.evaluate(function () {
            var info = new Object();
            document.body.bgColor = '#F6F6F6';
            info['title'] = document.title ? document.title : undefined;
            var icon = document.getElementsByTagName('link');
            for(var i in icon) {
              try {
                if(icon[i].rel.toLowerCase().indexOf('icon') > -1) {
                  info['favicon'] = icon[i].href;
                  return info;
                }
              } catch(e) {
                info['favicon'] = 'https://plus.google.com/_/favicon?domain_url='+ window.location.origin;
                console.error(e.stack);
                return info;
              }
            }
          }, function (info) {
            var query = new Object({ name: doc.category });
            mongoose.model('category').findOne(query, function(err, cat) {
              if(err) return console.error(err);
              var data = methods.detach(doc._id, cat);
              if(data) {
                data.save(function(err, doc) {
                  if(err) {
                    req.flash('error', err);
                    res.redirect('update');
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
                      res.redirect('update');
                      return console.error(err);
                    }
                  });
                }
              });
            }
            var title = info.title ? entities.decode(info.title) : url;
            doc.name = req.body.name && ( oldAddress != req.body.address || oldAddress == req.body.address ) ? req.body.name : methods.shorter(title, 42);
            doc.url = req.body.address;
            doc.title = info.title;
            doc.icon = info ? info.favicon : undefined;
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
                if(oldAddress != req.body.address) {
                  console.log('UPDATE.TAB: "'+ doc.name +'" ('+ doc._id +') has been updated.');
                  req.flash('success', 'Tab has been updated successfully.');
                  req.body.check ? res.redirect('/account') : res.redirect('/');
                } else {
                  // Renders the web page to an image buffer and saves it as the specified filename.
                  page.render(uploadPath+doc._id +'.png');
                  console.log('UPDATE.TAB: "'+ doc.name +'" ('+ doc._id +') has been updated.');
                  req.flash('success', 'Tab has been updated successfully.');
                  req.body.check ? res.redirect('/account') : res.redirect('/');
                }
                ph.exit();
              });
            } catch(e) {
              console.error(e.stack);
            }
          });
        });
      });
    });
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
function postTabDelete(req, res) {
  console.log('DELETE.TAB: body request');
  console.log(req.body);
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
              res.redirect('/');
              return console.error(err);
            }
          });
        }
        tab.remove(function(err, doc) {
          if(err) {
            req.flash('error', err);
            res.redirect('/');
            return console.error(err);
          } else {
            methods.clear(req);
            console.log('DELETE.TAB: '+ doc +' has been deleted.');
            req.flash('success', 'Tab has been deleted successfully.');
            res.redirect('/');
          }
        });
      } catch(e) {
        console.error(e.stack);
      }
    });
  });
};

/**
 * Pass a local variable to the confirm page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postConfirm(req, res) {
  console.log(req.body);
  var ro = new RenderObject();
  ro.set({
    title: 'Confirm',
    action: urlparse(req.path).directory,
    confirm: req.body,
    user: req.user,
    info: req.flash('info'),
    error: req.flash('error'),
    success: req.flash('success')
  });
  res.render('sites/confirm', ro.get());
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
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
