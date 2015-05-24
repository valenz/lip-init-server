var Entities = require('html-entities').AllHtmlEntities;
var mongoose = require('mongoose');
var urlparse = require('urlparse');
var winston = require('winston');

var methods = require('../classes/methods/methods');
var RenderObject = require('../classes/render');
var log = winston.loggers.get('log');
var config = require('../config');

var entities = new Entities();
methods.mkdirSync(config.loggers.log.file.filename);

/**
 ********************************* EXPORTS *********************************
 */

module.exports.login = login;
module.exports.logout = logout;
module.exports.index = index;
module.exports.accounts = accounts;
module.exports.settings = settings;
module.exports.logging = logging;
module.exports.help = help;
module.exports.accountCreate = accountCreate;
module.exports.categoryCreate = categoryCreate;
module.exports.tabCreate = tabCreate;

module.exports.postPrefer = postPrefer;
module.exports.postLogin = postLogin;
module.exports.postAccountCreate = postAccountCreate;
module.exports.postAccountUpdate = postAccountUpdate;
module.exports.postAccountEdit = postAccountEdit;
module.exports.postAccountDetails = postAccountDetails;
module.exports.postAccountDelete = postAccountDelete;
module.exports.postCategoryCreate = postCategoryCreate;
module.exports.postCategoryUpdate = postCategoryUpdate;
module.exports.postCategoryEdit = postCategoryEdit;
module.exports.postCategoryDetails = postCategoryDetails;
module.exports.postCategoryDelete = postCategoryDelete;
module.exports.postTabCreate = postTabCreate;
module.exports.postTabUpdate = postTabUpdate;
module.exports.postTabEdit = postTabEdit;
module.exports.postTabDetails = postTabDetails;
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
}

/**
 * Calls the exported function logout in methods
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 */
function logout(req, res) {
  closeSession(req, res);
  res.redirect('/');
}

/**
 * Selects all documents in collection tab, sorted by the field whenCreated
 * in descending order and pass a local variable to the user page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function index(req, res) {
  mongoose.model('tab').find({}, null, { sort: { prefer: -1, whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
    if(err) throw new Error(err);
    mongoose.model('category').find({}, null, { sort: { name: -1 }, skip: 0, limit: 0 }, function(err, category) {
      if(err) throw new Error(err);
      var ro = new RenderObject();
      ro.set({
        title: 'Index',
        grid: tab,
        list: category,
        user: req.user,
        usertabs: methods.getUserTabs(tab),
        assigned: methods.getAssignedTabs(category),
        info: req.flash('info'),
        error: req.flash('error'),
        success: req.flash('success')
      });
      res.render('index', ro.get());
    });
  });
}

/**
 * Selects all documents in collection tab, sorted by the field whenCreated
 * in descending order and pass a local variable to the user page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function accounts(req, res) {
  mongoose.model('tab').find({}, null, { sort: { prefer: -1, whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
    if(err) throw new Error(err);
    mongoose.model('category').find({}, null, { sort: { name: -1 }, skip: 0, limit: 0 }, function(err, category) {
      if(err) throw new Error(err);
      var ro = new RenderObject();
      ro.set({
        title: req.user.username,
        grid: tab,
        list: category,
        user: req.user,
        usertabs: methods.getUserTabs(tab),
        assigned: methods.getAssignedTabs(category),
        info: req.flash('info'),
        error: req.flash('error'),
        success: req.flash('success')
      });
      res.render('sites/accounts', ro.get());
    });
  });
}

/**
 * Selects all documents in collection tab and account, sorted by the field name
 * in ascending order and pass a local variable to the settings page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function settings(req, res) {
  mongoose.model('tab').find({}, null, { sort: { check: 1, name: 1 }, skip: 0, limit: 0 }, function(err, tab) {
    if(err) throw new Error(err);
    mongoose.model('account').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, account) {
      if(err) throw new Error(err);
      mongoose.model('category').find({}, null, { sort: { normalized: 1, name: -1 }, skip: 0, limit: 0 }, function(err, category) {
        if(err) throw new Error(err);
        var ro = new RenderObject();
        ro.set({
          title: 'Settings',
          cats: category,
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
}

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
}

/**
 * Pass a local variable to the log page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function logging(req, res) {
  var ro = new RenderObject();
  methods.getLog(function(log) {
    ro.set({
      title: 'Logging',
      level: config.loggers.log.file.level,
      env: config.env,
      file: log,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('sites/log', ro.get());
  });
}

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
}

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
}

/**
 * Selects all documents in collection category and pass a local variable to
 * the tab_create page. Get an array of flash messages by passing the keys to
 * req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function tabCreate(req, res) {
  mongoose.model('category').find({}, null, { sort: { normalized: 1, name: -1 }, skip: 0, limit: 0 }, function(err, category) {
    if(err) throw new Error(err);
    var ro = new RenderObject();
    ro.set({
      title: 'Create Tab',
      cats: category,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('forms/tab_create', ro.get());
  });
}

/**
 ******************************* POST METHODS *******************************
 */

/**
 * Increases the value of the preference of a Tab.
 * @param {Object} req
 */
function postPrefer(req) {
  var query = new Object({ _id: req.body.id });
  mongoose.model('tab').findOne(query, function(err, tab) {
    if(err) throw new Error(err);
    if(!tab) throw new Error('Data was not found.', tab);

    tab.prefer = tab.prefer ? tab.prefer + 1 : 1;

    try {
      tab.save(function(err) {
        if(err) throw new Error(err);
      });
    } catch(e) {
      log.error(e.stack);
    }
  });
}

/**
 * Sets a flash message by passing the key, followed by the value, to req.flash()
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 */
function postLogin(req, res) {
  log.info('%s %s %d - Logged in %s - %s', req.method, req.path, res.statusCode, req.user.username, req.headers['user-agent']);
  req.flash('success', 'You are logged in.');
  res.redirect('/accounts/'+ req.user.username);
}

/**
 * Pass a local variable to the account_update form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postAccountEdit(req, res) {
  var query = new Object({ _id: req.body.id });
  mongoose.model('account').findOne(query, function(err, acc) {
    if(err) throw new Error(err);
    var ro = new RenderObject();
    ro.set({
      title: 'Update Account',
      acc: acc,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('forms/account_update', ro.get());
  });
}

/**
 * Pass a local variable to the user_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postAccountDetails(req, res) {
  var query = new Object({ _id: req.body.id });
  mongoose.model('account').findOne(query, function(err, acc) {
    if(err) throw new Error(err);
    var ro = new RenderObject();
    ro.set({
      title: 'Account Details',
      acc: acc,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('forms/account_details', ro.get());
  });
}

/**
 * Pass a local variable to the category_update form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postCategoryEdit(req, res) {
  var query = new Object({ _id: req.body.id });
  mongoose.model('category').findOne(query, function(err, cat) {
    if(err) throw new Error(err);
    var ro = new RenderObject();
    ro.set({
      title: 'Update Category',
      cat: cat,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('forms/category_update', ro.get());
  });
}

/**
 * Pass a local variable to the category_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postCategoryDetails(req, res) {
  var query = new Object({ _id: req.body.id });
  mongoose.model('category').findOne(query, function(err, cat) {
    if(err) throw new Error(err);
    var ro = new RenderObject();
    ro.set({
      title: 'Category Details',
      cat: cat,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('forms/category_details', ro.get());
  });
}

/**
 * Pass a local variable to the tab_update form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postTabEdit(req, res) {
  var query = new Object({ _id: req.body.id });
  mongoose.model('tab').findOne(query, function(err, tab) {
    if(err) throw new Error(err);
    mongoose.model('category').find({}, null, { sort: { normalized: 1, name: -1 }, skip: 0, limit: 0 }, function(err, category) {
      if(err) throw new Error(err);
      var ro = new RenderObject();
      ro.set({
        title: 'Update Tab',
        cats: category,
        tab: tab,
        user: req.user,
        info: req.flash('info'),
        error: req.flash('error'),
        success: req.flash('success')
      });
      res.render('forms/tab_update', ro.get());
    });
  });
}

/**
 * Pass a local variable to the tab_details form page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postTabDetails(req, res) {
  var query = new Object({ _id: req.body.id });
  mongoose.model('tab').findOne(query, function(err, tab) {
    if(err) throw new Error(err);
    var ro = new RenderObject();
    ro.set({
      title: 'Tab Details',
      tab: tab,
      user: req.user,
      info: req.flash('info'),
      error: req.flash('error'),
      success: req.flash('success')
    });
    res.render('forms/tab_details', ro.get());
  });
}

/**
 * Creates a new object with request parameters from the submitted form name attributes
 * and tries to save the object to the collection account as a new document.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postAccountCreate(req, res) {
  if(req.body.username && req.body.password && req.body.confirm && req.body.role) {
    log.verbose(JSON.stringify(req.body.username));
    var ro = new RenderObject();
    ro.set({
      username: req.body.username,
      role: req.body.role,
      whoCreated: req.user ? req.user.username : req.body.username,
      whoUpdated: '',
      whenCreated: new Date().toISOString(),
      whenUpdated: ''
    });

    var Account = mongoose.model('account');

    if(req.body.password === req.body.confirm) {
      try {
        // The passport-local-mongoose package automatically takes care of salting and hashing the password.
        Account.register(new Account(ro.get()), req.body.password, function(err, doc) {
          if(err) {
            req.flash('error', err.message);
            res.redirect('/settings');
            throw new Error(err);
          }
          if(!doc) {
            req.flash('error', 'Data was not found: %s', doc);
            res.redirect('create');
            throw new Error('Data was not found.', doc);
          }

          log.verbose(JSON.stringify(doc._doc));

          log.info('%s %s %d - "Created %s" - %s', req.method, req.path, res.statusCode, doc.username, req.headers['user-agent']);
          req.flash('success', 'Account has been created successfully.');
          res.redirect('/settings');
        });
      } catch(e) {
        log.error(e.stack);
      }
    } else {
      log.error('%s %s %d - "Passwords did not match" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
      req.flash('info', 'Account could not be created. Passwords did not match.');
      res.redirect('create');
    }
  } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
    req.flash('error', 'Request error. Please fill the required fields.');
    res.redirect('create');
  }
}

/**
 * Selects all documents in collection account with queried object
 * and tries to update the document from the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postAccountUpdate(req, res) {
  if(req.user) {
    if(req.body.newPassword && req.body.confirm && req.body.role) {
      log.verbose(JSON.stringify(req.user._doc));
      var query = new Object({ _id: req.user._id });
      if(req.body.newPassword === req.body.confirm) {
        mongoose.model('account').findOne(query, function(err, acc) {
          if(err) throw new Error(err);
          if(!acc) {
            req.flash('error', 'Data was not found: %s', acc);
            res.redirect('/settings');
            throw new Error('Data was not found.', acc);
          }

          acc.setPassword(req.body.newPassword, function(err, doc) {
            if(err) throw new Error(err);
            if(!doc) {
              req.flash('error', 'Data was not found: %s', doc);
              res.redirect('/settings');
              throw new Error('Data was not found.', doc);
            }

            doc.role = req.body.role;
            doc.whoUpdated = req.user.username;
            doc.whenUpdated = new Date().toISOString();
            doc.__v = doc.__v + 1;

            try {
              doc.save(function(err, doc) {
                if(err) {
                  req.flash('error', err.message);
                  res.redirect('/settings');
                  throw new Error(err);
                }
                if(!doc) {
                  req.flash('error', 'Data was not found: %s', doc);
                  res.redirect('/settings');
                  throw new Error('Data was not found.', doc);
                }

                log.verbose(JSON.stringify(doc._doc));

                log.info('%s %s %d - "Updated %s" - %s', req.method, req.path, res.statusCode, doc.username, req.headers['user-agent']);
                req.flash('success', 'Password has been set successfully.');
                res.redirect('/settings');
              });
            } catch(e) {
              log.error(e.stack);
            }
          });
        });
      } else {
        log.error('%s %s %d - "Passwords did not match" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
        req.flash('info', 'Account could not be updated. Passwords did not match.');
        res.redirect('/settings');
      }
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('/settings');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

/**
 * Selects all documents in collection account with queried object
 * and tries to remove the document from the collection. Only if the
 * total number of accounts is greater than one.
 * Calls the exported function logout in methods
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postAccountDelete(req, res) {
  if(req.user) {
    if(req.body.id) {
      log.verbose(JSON.stringify(req.body));
      var query = new Object({ _id: req.body.id });
      mongoose.model('account').find(function(err, allAcc) {
        if(err) throw new Error(err);
        if(!allAcc) {
          req.flash('error', 'Data was not found: %s', allAcc);
          res.redirect('/settings');
          throw new Error('Data was not found.', allAcc);
        }

        mongoose.model('account').findOne(query, function(err, acc) {
          if(err) throw new Error(err);
          if(!acc) {
            req.flash('error', 'Data was not found: %s', acc);
            res.redirect('/settings');
            throw new Error('Data was not found.', acc);
          }

          if(allAcc.length > 1) {
            try {
              acc.remove(function(err, doc) {
                if(err) {
                  req.flash('error', err.message);
                  res.redirect('/settings');
                  throw new Error(err);
                }
                if(!doc) {
                  req.flash('error', 'Data was not found: %s', doc);
                  res.redirect('/settings');
                  throw new Error('Data was not found.', doc);
                }

                log.verbose(JSON.stringify(doc._doc));

                closeSession(req, res);

                log.info('%s %s %d - "Deleted %s" - %s', req.method, req.path, res.statusCode, doc.username, req.headers['user-agent']);
                req.flash('success', 'Account has been deleted successfully.');
                res.redirect('/');
              });
            } catch(e) {
              log.error(e.stack);
            }
          } else {
            log.warn('%s %s %d - "Request ignored %s" - %s', req.method, req.path, res.statusCode, acc.username, req.headers['user-agent']);
            req.flash('info', 'Account could not be deleted. Please create a new one first.');
            res.redirect('/settings');
          }
        });
      });
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('/settings');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

/**
 * Creates a new Category with request parameters from the submitted form name
 * attributes and tries to save the object to the collection category list.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postCategoryCreate(req, res) {
  if(req.user) {
    if(req.body.categoryname) {
      log.verbose(JSON.stringify(req.body));
      var category = req.body.categoryname;
      var Category = mongoose.model('category');
      var ro = new RenderObject();
      ro.set({
        name: category,
        normalized: category.toLowerCase(),
        list: [],
        whoCreated: req.user.username,
        whoUpdated: '',
        whenCreated: new Date().toISOString(),
        whenUpdated: ''
      });
      var data = new Category(ro.get());

      try {
        data.save(function(err, doc) {
          if(err) {
            req.flash('error', 'Category already exists with name "%s".', category);
            res.redirect('create');
            throw new Error(err);
          }
          if(!doc) {
            req.flash('error', 'Data was not found: %s', doc);
            res.redirect('create');
            throw new Error('Data was not found.', doc);
          }

          log.verbose(JSON.stringify(doc._doc));

          log.info('%s %s %d - "Created %s (%s)" - %s', req.method, req.path, res.statusCode, doc._id, doc.name, req.headers['user-agent']);
          req.flash('success', 'Category "%s" has been created successfully.', doc.name);
          res.redirect('create');
        });
      } catch(e) {
        log.error(e.stack);
      }
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('create');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

/**
 * Selects all documents in collection category with queried object,
 * updated the category of all associated tabs and
 * tries to save the new document from the collection.
 * Given category must be different from the old one.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postCategoryUpdate(req, res) {
  if(req.user) {
    if(req.body.id) {
      log.verbose(JSON.stringify(req.body));
      var query = new Object({ _id: req.body.id });
      mongoose.model('category').findOne(query, function(err, cat) {
        if(err) throw new Error(err);
        if(!cat) {
          req.flash('error', 'Data was not found: %s', cat);
          res.redirect('/settings');
          throw new Error('Data was not found.', cat);
        }

        var catNew = req.body.categoryname;
        var catOld = cat.name;

        if(catNew && cat.name !== catNew) {
          cat.name = catNew;
          cat.normalized = catNew.toLowerCase();
          cat.whoCreated = cat.whoCreated;
          cat.whoUpdated = req.user.username;
          cat.whenCreated = cat.whenCreated;
          cat.whenUpdated = new Date().toISOString();

          try {
            cat.save(function(err, doc) {
              if(err) {
                req.flash('error', 'Category already exists with name %s.', req.body.categoryname);
                res.redirect('/settings');
                throw new Error(err);
              }
              if(!doc) {
                req.flash('error', 'Data was not found: %s', doc);
                res.redirect('/settings');
                throw new Error('Data was not found.', doc);
              }

              log.verbose(JSON.stringify(doc._doc));

              log.info('%s %s %d - "Updated %s (%s)" - %s', req.method, req.path, res.statusCode, doc._id, doc.name, req.headers['user-agent']);
              req.flash('success', 'Category "%s" has been updated successfully to "%s".', catOld, catNew);
              res.redirect('/settings');
            });
          } catch(e) {
            log.error(e.stack);
          }

          for(var i = 0; i < cat.list.length; i++) {
            query = new Object({ _id: cat.list[i]._id });
            mongoose.model('tab').findOne(query, function(err, tab) {
              if(err) throw new Error(err);
              if(!tab) {
                req.flash('error', 'Data was not found: %s', tab);
                throw new Error('Data was not found.', tab);
              }

              tab.category = catNew;

              try {
                tab.save(function(err, doc) {
                  if(err) {
                    req.flash('error', err.message);
                    res.redirect('/settings');
                    throw new Error(err);
                  }
                });
              } catch(e) {
                log.error(e.stack);
              }
            });
          }
        } else {
          log.warn('%s %s %d - "Request ignored %s (%s)" - %s', req.method, req.path, res.statusCode, cat._id, cat.name, req.headers['user-agent']);
          req.flash('info', 'Name of the category is the same. Nothing has been updated.');
          res.redirect('/settings');
        }
      });
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('/settings');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

/**
 * Selects all documents in collection category with queried object,
 * removes the category of all associated tabs and
 * tries to remove the document from the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postCategoryDelete(req, res) {
  if(req.user) {
    if(req.body.id) {
      log.verbose(JSON.stringify(req.body));
      var query = new Object({ _id: req.body.id });
      mongoose.model('category').findOne(query, function(err, cat) {
        if(err) throw new Error(err);
        if(!cat) {
          req.flash('error', 'Data was not found: %s', cat);
          res.redirect('/settings');
          throw new Error('Data was not found.', cat);
        }

        for(var i = 0; i < cat.list.length; i++) {
          query = new Object({ _id: cat.list[i]._id });
          mongoose.model('tab').findOne(query, function(err, tab) {
            if(err) throw new Error(err);
            if(!tab) {
              req.flash('error', 'Data was not found: %s', tab);
              throw new Error('Data was not found.', tab);
            }

            tab.category = '';

            try {
              tab.save(function(err, doc) {
                if(err) {
                  req.flash('error', err.message);
                  res.redirect('/settings');
                  throw new Error(err);
                }
              });
            } catch(e) {
              log.error(e.stack);
            }
          });
        }

        try {
          cat.remove(function(err, doc) {
            if(err) {
              req.flash('error', err.message);
              res.redirect('/settings');
              throw new Error(err);
            }
            if(!doc) {
              req.flash('error', 'Data was not found: %s', doc);
              res.redirect('/settings');
              throw new Error('Data was not found.', doc);
            }

            log.verbose(JSON.stringify(doc._doc));

            log.info('%s %s %d - "Deleted %s (%s)" - %s', req.method, req.path, res.statusCode, doc._id, doc.name, req.headers['user-agent']);
            req.flash('success', 'Category "%s" has been deleted successfully.', doc.name);
            res.redirect('/settings');
          });
        } catch(e) {
          log.error(e.stack);
        }
      });
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('/settings');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

/**
 * Creates a new Tab with request parameters from the submitted form name attributes.
 * Opens the given url and loads it to the page and provides the page status to the
 * function ('success' or 'fail'). Evaluates the given function in the
 * context of the web page and tries to save the document to the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postTabCreate(req, res) {
  if(req.user) {
    if(req.body.renderUrl) {
      log.verbose(JSON.stringify(req.body));
      var url = req.body.address ? urlparse(req.body.address).normalize().toString() : urlparse(req.body.renderUrl).normalize().toString();

      methods.getPageInfo(url, function(info) {
        var title = info && info.title ? entities.decode(info.title) : url;

        var Tab = mongoose.model('tab');
        var ro = new RenderObject();
        ro.set({
          name: req.body.name ? methods.shorter(req.body.name) : methods.shorter(title),
          renderUrl: req.body.renderUrl,
          url: url,
          title: title,
          icon: info && info.favicon ? info.favicon : '',
          image: methods.random() + '.' + config.ph.render.options.format,
          category: req.body.category,
          check: req.body.check ? true : false,
          prefer: 0,
          whoCreated: req.user.username,
          whoUpdated: '',
          whenCreated: new Date().toISOString(),
          whenUpdated: ''
        });
        var data = new Tab(ro.get());

        try {
          data.save(function(err, doc) {
            if(err) {
              req.flash('error', err.message);
              res.redirect('/settings');
              throw new Error(err);
            }
            if(!doc) {
              req.flash('error', 'Data was not found: %s', doc);
              res.redirect('create');
              throw new Error('Data was not found.', doc);
            }

            if(req.body.category) {
              var query = new Object({ name: req.body.category });
              mongoose.model('category').findOne(query, function(err, cat) {
                if(err) throw new Error(err);
                if(!cat) {
                  req.flash('error', 'Data was not found: %s', cat);
                  res.redirect('create');
                  throw new Error('Data was not found.', cat);
                }

                var data = methods.attach(doc, cat);

                if(data) {
                  data.save(function(err, doc) {
                    if(err) {
                      req.flash('error', err.message);
                      res.redirect('/settings');
                      throw new Error(err);
                    }
                  });
                }
              });
            }

            log.verbose(JSON.stringify(doc._doc));

            methods.renderPage({ url: urlparse(req.body.renderUrl).normalize().toString(), filename: doc.image }, function() {
              log.info('%s %s %d - "Created %s (%s)" - %s', req.method, req.path, res.statusCode, doc._id, doc.name, req.headers['user-agent']);
              req.flash('success', 'Tab has been created successfully.');
              res.redirect('create');
            });
          });
        } catch(e) {
          log.error(e.stack);
        }
      });
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('create');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

/**
 * Updated the given Tab with request parameters from the submitted form name
 * attributes.
 * Opens the given url, loads it to the page and provides the page status to the
 * function ('success' or 'fail'). Evaluates the given function in the
 * context of the web page and tries to save the document to the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postTabUpdate(req, res) {
  if(req.user) {
    if(req.body.renderUrl) {
      log.verbose(JSON.stringify(req.body));
      var query = new Object({ _id: req.body.id });
      mongoose.model('tab').findOne(query, function(err, tab) {
        if(err) throw new Error(err);
        if(!tab) {
          req.flash('error', 'Data was not found: %s', tab);
          res.redirect('/settings');
          throw new Error('Data was not found.', tab);
        }

        if(tab.category) {
          query = new Object({ name: tab.category });
          mongoose.model('category').findOne(query, function(err, cat) {
            if(err) throw new Error(err);
            if(!cat) {
              req.flash('error', 'Data was not found: %s', cat);
              res.redirect('/settings');
              throw new Error('Data was not found.', cat);
            }

            var data = methods.detach(tab._id, cat);

            if(data) {
              data.save(function(err, tab) {
                if(err) {
                  req.flash('error', err.message);
                  res.redirect('/settings');
                  throw new Error(err);
                }
              });
            }
          });
        }

        var renderUrlTmp = tab.renderUrl;
        var url = req.body.address ? urlparse(req.body.address).normalize().toString() : urlparse(req.body.renderUrl).normalize().toString();

        methods.getPageInfo(url, function(info) {
          var title = info && info.title ? entities.decode(info.title) : url;

          tab.name = req.body.name && req.body.address ? methods.shorter(req.body.name) : methods.shorter(title);
          tab.renderUrl = req.body.renderUrl;
          tab.url = url;
          tab.title = title;
          tab.icon = info && info.favicon ? info.favicon : '';
          tab.image = tab.image;
          tab.category = req.body.category;
          tab.check = req.body.check ? true : false;
          tab.prefer = tab.prefer ? tab.prefer : 0;
          tab.whoCreated = tab.whoCreated;
          tab.whoUpdated = req.user.username;
          tab.whenCreated = tab.whenCreated;
          tab.whenUpdated = new Date().toISOString();
          tab.__v = tab.__v + 1;

          if(!req.body.check && req.body.category) {
            query = new Object({ name: req.body.category });
            mongoose.model('category').findOne(query, function(err, cat) {
              if(err) throw new Error(err);
              if(!cat) {
                req.flash('error', 'Data was not found: %s', cat);
                res.redirect('/settings');
                throw new Error('Data was not found.', cat);
              }

              var data = methods.attach(tab, cat);

              if(data) {
                data.save(function(err, doc) {
                  if(err) {
                    req.flash('error', err.message);
                    res.redirect('/settings');
                    throw new Error(err);
                  }
                });
              }
            });
          }

          try {
            tab.save(function(err, doc) {
              if(err) {
                req.flash('error', err.message);
                res.redirect('/settings');
                throw new Error(err);
              }
              if(!doc) {
                req.flash('error', 'Data was not found: %s', doc);
                res.redirect('/settings');
                throw new Error('Data was not found.', doc);
              }

              log.verbose(JSON.stringify(doc._doc));

              methods.renderPage({ url: urlparse(req.body.renderUrl).normalize().toString(), filename: doc.image }, function() {
                log.info('%s %s %d - "Updated %s (%s)" - %s', req.method, req.path, res.statusCode, doc._id, doc.name, req.headers['user-agent']);
                req.flash('success', 'Tab has been updated successfully.');
                if(req.body.check) {
                  res.redirect('/accounts/'+ req.user.username);
                } else {
                  res.redirect('/');
                }
              });
            });
          } catch(e) {
            log.error(e.stack);
          }
        });
      });
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('/settings');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

/**
 * Selects all documents in collection tab with queried object
 * and tries to remove the document from the collection.
 * Calls the exported function clear in methods
 * and redirect to the given url.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postTabDelete(req, res) {
  if(req.user) {
    if(req.body.id) {
      log.verbose(JSON.stringify(req.body));
      var query = new Object({ _id: req.body.id });
      mongoose.model('tab').findOne(query, function(err, tab) {
        if(err) throw new Error(err);
        if(!tab) {
          req.flash('error', 'Data was not found: %s', tab);
          res.redirect('/');
          throw new Error('Data was not found.', tab);
        }

        if(tab.category) {
          query = new Object({ name: tab.category });
          mongoose.model('category').findOne(query, function(err, cat) {
            if(err) throw new Error(err);
            if(!cat) {
              req.flash('error', 'Data was not found: %s', cat);
              throw new Error('Data was not found.', cat);
            }

            try {
              var data = methods.detach(tab._id, cat);

              if(data) {
                data.save(function(err, doc) {
                  if(err) {
                    req.flash('error', err.message);
                    res.redirect('/settings');
                    throw new Error(err);
                  }
                });
              }
            } catch(e) {
              log.error(e.stack);
            }
          });
        }

        try {
          tab.remove(function(err, doc) {
            if(err) {
              req.flash('error', err.message);
              res.redirect('/settings');
              throw new Error(err);
            }
            if(!doc) {
              req.flash('error', 'Data was not found: %s', doc);
              res.redirect('/');
              throw new Error('Data was not found.', doc);
            }

            log.verbose(JSON.stringify(doc._doc));
            methods.clear(doc.image);

            log.info('%s %s %d - "Deleted %s (%s)" - %s', req.method, req.path, res.statusCode, doc._id, doc.name, req.headers['user-agent']);
            req.flash('success', 'Tab has been deleted successfully.');
            if(doc.check) {
              res.redirect('/accounts/'+ req.user.username);
            } else {
              res.redirect('/');
            }
          });
        } catch(e) {
          log.error(e.stack);
        }
      });
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('/');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

/**
 * Pass a local variable to the confirm page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postConfirm(req, res) {
  if(req.user) {
    if(req.body.id) {
      log.verbose(JSON.stringify(req.body));
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
    } else {
      log.error('%s %s %d - "Request error %j" - %s', req.method, req.path, res.statusCode, req.body, req.headers['user-agent']);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('confirm');
    }
  } else {
    log.error('%s %s %d - "Session expired" - %s', req.method, req.path, res.statusCode, req.headers['user-agent']);
    req.flash('info', 'Session expired. Please log in.');
    res.redirect('/');
  }
}

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

/**
 * Set a flash message by passing the key, followed by the value, to req.flash()
 * and remove the req.user property and clear the login session.
 * @param {Object} req
 * @param {Object} res
 */
function closeSession(req, res) {
  log.info('%s %s %d - "Logged out %s" - %s', req.method, req.path, res.statusCode, req.user.username, req.headers['user-agent']);
  req.flash('success', 'You are logged out.');
  req.logout();
}
