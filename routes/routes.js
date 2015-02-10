var Entities = require('html-entities').AllHtmlEntities;
var mongoose = require('mongoose');
var urlparse = require('urlparse');

var methods = require('../classes/methods/methods');
var RenderObject = require('../classes/render');
var config = require('../config');

var entities = new Entities();

/**
 ********************************* EXPORTS *********************************
 */

module.exports.login = login;
module.exports.logout = logout;
module.exports.index = index;
module.exports.accounts = accounts;
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
    if(err) throw new Error(err);
    mongoose.model('category').find({}, null, { sort: { name: -1 }, skip: 0, limit: 0 }, function(err, category) {
      if(err) throw new Error(err);
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
function accounts(req, res) {
  mongoose.model('tab').find({}, null, { sort: { whenCreated: -1 }, skip: 0, limit: 0 }, function(err, tab) {
    if(err) throw new Error(err);
    mongoose.model('category').find({}, null, { sort: { name: -1 }, skip: 0, limit: 0 }, function(err, category) {
      if(err) throw new Error(err);
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
      res.render('sites/accounts', ro.get());
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
    if(err) throw new Error(err);
    mongoose.model('account').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, account) {
      if(err) throw new Error(err);
      mongoose.model('category').find({}, null, { sort: { name: 1 }, skip: 0, limit: 0 }, function(err, category) {
        if(err) throw new Error(err);
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
    if(err) throw new Error(err);
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
    if(err) throw new Error(err);
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
  console.log('LOGIN: "'+ req.user.username +'" has been logged in.');
  req.flash('success', 'You are logged in. Welcome, '+ req.user.username +'!');
  res.redirect('/accounts/'+ req.user.username);
};

/**
 * Creates a new object with request parameters from the submitted form name attributes
 * and tries to save the object to the collection account as a new document.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postAccountCreate(req, res) {
  console.log('CREATE.ACCOUNT: body request');
  console.log(req.body.username);

  if(req.body.username && req.body.password && req.body.confirm) {
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
            req.flash('error', JSON.stringify(err.message));
            res.redirect('create');
            throw new Error(err);
          }
          if(!doc) {
            req.flash('error', 'Data was not found: '+ doc);
            res.redirect('create');
            throw new Error('Data was not found: '+ doc);
          }

          console.log('CREATE.ACCOUNT: "'+ doc.username +'" has been created successfully.');
          req.flash('success', 'Account has been created successfully.');
          res.redirect('/settings');
        });
      } catch(e) {
        console.error(e.stack);
      }
    } else {
      req.flash('info', 'Account could not be created. Passwords did not match.');
      res.redirect('create');
    }
  } else {
    console.log('CONFIRM: Request error.'+ req.body);
    req.flash('error', 'Request error. Please fill the required fields.');
    res.redirect('create');
  }
};

/**
 * Selects all documents in collection account with queried object
 * and tries to update the document from the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postAccountUpdate(req, res) {
  console.log('UPDATE.ACCOUNT: body request');
  console.log(req.user._doc);

  if(req.user) {
    if(req.body.newPassword && req.body.confirm) {
      var query = new Object({ _id: req.user._id });
      if(req.body.newPassword === req.body.confirm) {
        mongoose.model('account').findOne(query, function(err, acc) {
          if(err) throw new Error(err);
          if(!acc) {
            req.flash('error', 'Data was not found: '+ acc);
            res.redirect('update');
            throw new Error('Data was not found: '+ acc);
          }

          acc.setPassword(req.body.newPassword, function(err, doc) {
            if(err) throw new Error(err);
            if(!doc) {
              req.flash('error', 'Data was not found: '+ doc);
              res.redirect('update');
              throw new Error('Data was not found: '+ doc);
            }

            doc.whenUpdated = new Date();

            try {
              doc.save(function(err, doc) {
                if(err) throw new Error(err);
                if(!doc) {
                  req.flash('error', 'Data was not found: '+ doc);
                  res.redirect('update');
                  throw new Error('Data was not found: '+ doc);
                }

                console.log('UPDATE.ACCOUNT: "'+ doc.username +'" was updated successfully.');
                req.flash('success', 'Password has been set successfully.');
                res.redirect('/settings');
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
    } else {
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('update');
    }
  } else {
    console.log('UPDATE.ACCOUNT: Account could not be updated. Session is expired.');
    req.flash('info', 'Account could not be updated. Your session is expired. Please log in.');
    res.redirect('/');
  }
};

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
  console.log('DELETE.ACCOUNT: body request');
  console.log(req.body);

  if(req.user) {
    if(req.body.id) {
      var query = new Object({ _id: req.body.id });
      mongoose.model('account').find(function(err, allAcc) {
        if(err) throw new Error(err);
        if(!allAcc) {
          req.flash('error', 'Data was not found: '+ allAcc);
          res.redirect('details');
          throw new Error('Data was not found: '+ allAcc);
        }

        mongoose.model('account').findOne(query, function(err, acc) {
          if(err) throw new Error(err);
          if(!acc) {
            req.flash('error', 'Data was not found: '+ acc);
            res.redirect('details');
            throw new Error('Data was not found: '+ acc);
          }

          if(allAcc.length > 1) {
            try {
              acc.remove(function(err, doc) {
                if(err) throw new Error(err);
                if(!doc) {
                  req.flash('error', 'Data was not found: '+ doc);
                  res.redirect('details');
                  throw new Error('Data was not found: '+ doc);
                }

                methods.logout(req, res);

                console.log('DELETE.ACCOUNT: "'+ doc.username +'" was deleted successfully. Account objects left (LENGTH): '+ allAcc.length);
                req.flash('success', 'Account has been deleted successfully.');
                res.redirect('/');
              });
            } catch(e) {
              console.error(e.stack);
            }
          } else {
            console.log('DELETE.ACCOUNT: "'+ acc.username +'" could not be deleted. Account objects left (LENGTH): '+ allAcc.length);
            req.flash('info', 'Account could not be deleted. Please create a new one first.');
            res.redirect('details');
          }
        });
      });
    } else {
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('details');
    }
  } else {
    console.log('DELETE.ACCOUNT: Account could not be deleted. Session is expired.');
    req.flash('info', 'Account could not be deleted. Your session is expired. Please log in.');
    res.redirect('/');
  }
};

/**
 * Creates a new Category with request parameters from the submitted form name
 * attributes and tries to save the object to the collection category list.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postCategoryCreate(req, res) {
  console.log('CREATE.CATEGORY: body request');
  console.log(req.body);

  if(req.user) {
    if(req.body.categoryname) {
      var category = req.body.categoryname;
      var Category = mongoose.model('category');
      var data = new Category({
        name: category,
        list: new Array()
      });

      try {
        data.save(function(err, doc) {
          if(err) throw new Error(err);
          if(!doc) {
            req.flash('error', 'Data was not found: '+ doc);
            res.redirect('create');
            throw new Error('Data was not found: '+ doc);
          }

          console.log('CREATE.CATEGORY: "'+ doc.name +'" ('+ doc._id +') has been created.');
          req.flash('success', 'Category "'+ doc.name +'" has been created successfully.');
          res.redirect('/settings');
        });
      } catch(e) {
        console.error(e.stack);
      }
    } else {
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('create');
    }
  } else {
    console.log('CREATE.CATEGORY: Category could not be created. Session is expired.');
    req.flash('info', 'Category could not be created. Your session is expired. Please log in.');
    res.redirect('/');
  }
};

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
  console.log('UPDATE.CATEGORY: body request');
  console.log(req.body);

  if(req.user) {
    if(req.body.id) {
      var query = new Object({ _id: req.body.id });
      mongoose.model('category').findOne(query, function(err, cat) {
        if(err) throw new Error(err);
        if(!cat) {
          req.flash('error', 'Data was not found: '+ cat);
          res.redirect('update');
          throw new Error('Data was not found: '+ cat);
        }

        var category = req.body.categoryname;
        category = category.substr(0, 1).toUpperCase() + category.substr(1, category.length);

        if(category && cat.name !== category) {
          cat.name = category;

          try {
            cat.save(function(err, doc) {
              if(err) throw new Error(err);
              if(!doc) {
                req.flash('error', 'Data was not found: '+ doc);
                res.redirect('update');
                throw new Error('Data was not found: '+ doc);
              }

              console.log('UPDATED.CATEGORY: "'+ doc.name +'" ('+ doc._id +') has been updated.');
              req.flash('success', 'Category "'+ doc.name +'" has been updated successfully.');
              res.redirect('/settings');
            });
          } catch(e) {
            console.error(e.stack);
          }

          for(var i = 0; i < cat.list.length; i++) {
            query = new Object({ _id: cat.list[i] });
            mongoose.model('tab').findOne(query, function(err, tab) {
              if(err) throw new Error(err);
              if(!tab) {
                req.flash('error', 'Data was not found: '+ tab);
                res.redirect('update');
                throw new Error('Data was not found: '+ tab);
              }

              tab.category = category;

              try {
                tab.save(function(err, doc) {
                  if(err) {
                    req.flash('error', JSON.stringify(err));
                    res.redirect('update');
                    throw new Error(err);
                  }
                });
              } catch(e) {
                console.error(e.stack);
              }
            });
          }
        } else {
          console.log('UPDATED.CATEGORY: "'+ cat.name +'" ('+ cat._id +') still same. Nothing updated.');
          req.flash('info', 'Category "'+ cat.name +'" still same. Nothing updated. Please type a different name.');
          res.redirect('/settings');
        }
      });
    } else {
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('update');
    }
  } else {
    console.log('UPDATE.CATEGORY: Category could not be updated. Session is expired.');
    req.flash('info', 'Category could not be updated. Your session is expired. Please log in.');
    res.redirect('/');
  }
};

/**
 * Selects all documents in collection category with queried object,
 * removes the category of all associated tabs and
 * tries to remove the document from the collection.
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function postCategoryDelete(req, res) {
  console.log('DELETE.CATEGORY: body request');
  console.log(req.body);

  if(req.user) {
    if(req.body.id) {
      var query = new Object({ _id: req.body.id });
      mongoose.model('category').findOne(query, function(err, cat) {
        if(err) throw new Error(err);
        if(!cat) {
          req.flash('error', 'Data was not found: '+ cat);
          res.redirect('/settings');
          throw new Error('Data was not found: '+ cat);
        }

        for(var i = 0; i < cat.list.length; i++) {
          query = new Object({ _id: cat.list[i] });
          mongoose.model('tab').findOne(query, function(err, tab) {
            if(err) throw new Error(err);
            if(!tab) {
              req.flash('error', 'Data was not found: '+ tab);
              res.redirect('/settings');
              throw new Error('Data was not found: '+ tab);
            }

            tab.category = undefined;

            try {
              tab.save(function(err, doc) {
                if(err) {
                  req.flash('error', JSON.stringify(err));
                  res.redirect('/settings');
                  throw new Error(err);
                }
              });
            } catch(e) {
              console.error(e.stack);
            }
          });
        }

        try {
          cat.remove(function(err, doc) {
            if(err) throw new Error(err);
            if(!doc) {
              req.flash('error', 'Data was not found: '+ doc);
              res.redirect('/settings');
              throw new Error('Data was not found: '+ doc);
            }

            console.log('DELETE.CATEGORY: '+ doc.name +' has been deleted.');
            req.flash('success', 'Category "'+ doc.name +'" has been deleted successfully.');
            res.redirect('/settings');
          });
        } catch(e) {
          console.error(e.stack);
        }
      });
    } else {
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('/settings');
    }
  } else {
    console.log('DELETE.CATEGORY: Category could not be deleted. Session is expired.');
    req.flash('info', 'Category could not be deleted. Your session is expired. Please log in.');
    res.redirect('/');
  }
};

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
  console.log('CREATE.TAB: body request');
  console.log(req.body);

  if(req.user) {
    if(req.body.renderUrl) {
      var url = req.body.address ? urlparse(req.body.address).normalize().toString() : urlparse(req.body.renderUrl).normalize().toString();

      methods.getPageInfo(url, function(info) {
        var title = info && info.title ? entities.decode(info.title) : url;

        var Tab = mongoose.model('tab');
        var data = new Tab({
          name: req.body.name ? methods.shorter(req.body.name, 42) : methods.shorter(title, 42),
          renderUrl: req.body.renderUrl,
          url: req.body.address ? req.body.address : req.body.renderUrl,
          title: title,
          icon: info && info.favicon ? info.favicon : undefined,
          image: methods.random() + '.' + config.ph.render.format,
          category: req.body.category,
          check: req.body.check ? true : false,
          whoCreated: req.user.username,
          whenCreated: new Date(),
          whenUpdated: undefined
        });

        console.log('CREATE.TAB: response ' + data);

        try {
          data.save(function(err, doc) {
            if(err) throw new Error(err);
            if(!doc) {
              req.flash('error', 'Data was not found: '+ doc);
              res.redirect('create');
              throw new Error('Data was not found: '+ doc);
            }

            if(req.body.category) {
              var query = new Object({ name: req.body.category });
              mongoose.model('category').findOne(query, function(err, cat) {
                if(err) throw new Error(err);
                if(!cat) {
                  req.flash('error', 'Data was not found: '+ cat);
                  res.redirect('create');
                  throw new Error('Data was not found: '+ cat);
                }

                var data = methods.paste(doc._id, cat);

                if(data) {
                  data.save(function(err, doc) {
                    if(err) {
                      req.flash('error', JSON.stringify(err));
                      res.redirect('create');
                      throw new Error(err);
                    }
                  });
                }
              });
            }

            methods.renderPage({ url: req.body.renderUrl, filename: doc.image }, function() {
              console.log('CREATE.TAB: "'+ doc.name +'" ('+ doc._id +') has been created.');
              req.flash('success', 'Tab has been created successfully.');
              res.redirect('create');
            });
          });
        } catch(e) {
          console.error(e.stack);
        }
      });
    } else {
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('create');
    }
  } else {
    console.log('CREATE.TAB: Tab could not be created. Session is expired.');
    req.flash('info', 'Tab could not be created. Your session is expired. Please log in.');
    res.redirect('/');
  }
};

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
  console.log('UPDATE.TAB: body request');
  console.log(req.body);

  if(req.user) {
    if(req.body.renderUrl) {
      var query = new Object({ _id: req.body.id });
      mongoose.model('tab').findOne(query, function(err, tab) {
        if(err) throw new Error(err);
        if(!tab) {
          req.flash('error', 'Data was not found: '+ tab);
          res.redirect('update');
          throw new Error('Data was not found: '+ tab);
        }

        if(tab.category) {
          var query = new Object({ name: tab.category });
          mongoose.model('category').findOne(query, function(err, cat) {
            if(err) throw new Error(err);
            if(!cat) {
              req.flash('error', 'Data was not found: '+ cat);
              res.redirect('update');
              throw new Error('Data was not found: '+ cat);
            }

            var data = methods.detach(tab._id, cat);

            if(data) {
              data.save(function(err, tab) {
                if(err) {
                  req.flash('error', JSON.stringify(err));
                  res.redirect('update');
                  throw new Error(err);
                }
              });
            }
          });
        }

        if(!req.body.check && req.body.category) {
          var query = new Object({ name: req.body.category });
          mongoose.model('category').findOne(query, function(err, cat) {
            if(err) throw new Error(err);
            if(!cat) {
              req.flash('error', 'Data was not found: '+ cat);
              res.redirect('update');
              throw new Error('Data was not found: '+ cat);
            }

            var data = methods.paste(tab._id, cat);

            if(data) {
              data.save(function(err, doc) {
                if(err) {
                  req.flash('error', JSON.stringify(err));
                  res.redirect('update');
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

          tab.name = req.body.name && req.body.address ? req.body.name : methods.shorter(title, 42);
          tab.renderUrl = req.body.renderUrl;
          tab.url = req.body.address ? req.body.address : req.body.renderUrl;
          tab.title = title;
          tab.icon = info && info.favicon ? info.favicon : undefined;
          tab.image = tab.image;
          tab.category = req.body.category;
          tab.check = req.body.check ? true : false;
          tab.whoCreated = tab.whoCreated;
          tab.whoUpdated = req.user.username;
          tab.whenCreated = tab.whenCreated;
          tab.whenUpdated = new Date();
          tab.__v = tab.__v + 1;

          console.log('UPDATE.TAB: response ' + tab);

          try {
            tab.save(function(err, doc) {
              if(err) throw new Error(err);
              if(!doc) {
                req.flash('error', 'Data was not found: '+ doc);
                res.redirect('update');
                throw new Error('Data was not found: '+ doc);
              }

              if(renderUrlTmp == req.body.renderUrl) {
                console.log('UPDATE.TAB: "'+ doc.name +'" ('+ doc._id +') has been updated.');
                req.flash('success', 'Tab has been updated successfully.');
                req.body.check ? res.redirect('/accounts/'+ req.user.username) : res.redirect('/');
              } else {
                methods.renderPage({ url: req.body.renderUrl, filename: doc.image }, function() {
                  console.log('UPDATE.TAB: "'+ doc.name +'" ('+ doc._id +') has been updated.');
                  req.flash('success', 'Tab has been updated successfully.');
                  req.body.check ? res.redirect('/accounts/'+ req.user.username) : res.redirect('/');
                });
              }
            });
          } catch(e) {
            console.error(e.stack);
          }
        });
      });
    } else {
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('update');
    }
  } else {
    console.log('UPDATE.TAB: Tab could not be updated. Session is expired.');
    req.flash('info', 'Tab could not be updated. Your session is expired. Please log in.');
    res.redirect('/');
  }
};

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
  console.log('DELETE.TAB: body request');
  console.log(req.body);

  if(req.user) {
    if(req.body.id) {
      var query = new Object({ _id: req.body.id });
      mongoose.model('tab').findOne(query, function(err, tab) {
        if(err) throw new Error(err);
        if(!tab) {
          req.flash('error', 'Data was not found: '+ tab);
          res.redirect('/');
          throw new Error('Data was not found: '+ tab);
        }

        if(tab.category) {
          query = new Object({ name: tab.category });
          mongoose.model('category').findOne(query, function(err, cat) {
            if(err) throw new Error(err);
            if(!cat) {
              req.flash('error', 'Data was not found: '+ cat);
              res.redirect('/');
              throw new Error('Data was not found: '+ cat);
            }

            try {
              var data = methods.detach(req.body.id, cat);

              if(data) {
                data.save(function(err, doc) {
                  if(err) {
                    req.flash('error', JSON.stringify(err));
                    res.redirect('/');
                    throw new Error(err);
                  }
                });
              }
            } catch(e) {
              console.error(e.stack);
            }
          });
        }

        try {
          tab.remove(function(err, doc) {
            if(err) throw new Error(err);
            if(!doc) {
              req.flash('error', 'Data was not found: '+ doc);
              res.redirect('/');
              throw new Error('Data was not found: '+ doc);
            }

            methods.clear(doc.image);

            console.log('DELETE.TAB: "'+ doc.name +'" has been deleted.');
            req.flash('success', 'Tab has been deleted successfully.');
            doc.check ? res.redirect('/accounts/'+ req.user.username) : res.redirect('/');
          });
        } catch(e) {
          console.error(e.stack);
        }
      });
    } else {
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('/');
    }
  } else {
    console.log('DELETE.TAB: Tab could not be deleted. Session is expired.');
    req.flash('info', 'Tab could not be deleted. Your session is expired. Please log in.');
    res.redirect('/');
  }
};

/**
 * Pass a local variable to the confirm page.
 * Get an array of flash messages by passing the keys to req.flash().
 * @param {Object} req
 * @param {Object} res
 */
function postConfirm(req, res) {
  console.log(req.body);

  if(req.user) {
    if(req.body) {
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
      console.log('CONFIRM: Request error.'+ req.body);
      req.flash('error', 'Request error. Please fill the required fields.');
      res.redirect('confirm');
    }
  } else {
    console.log('CONFIRM: Session is expired.');
    req.flash('info', 'Your session is expired. Please log in.');
    res.redirect('/');
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
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
