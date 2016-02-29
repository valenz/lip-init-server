var fs = require('fs');
var mkdirp = require('mkdirp');
var winston = require('winston');
var config = require('../../config');
var log = winston.loggers.get('log');

/**
 ********************************* EXPORTS *********************************
 */

module.exports.writeFile = writeFile;
module.exports.getUserTabs = getUserTabs;
module.exports.getAssignedTabs = getAssignedTabs;
module.exports.shorter = shorter;
module.exports.attach = attach;
module.exports.detach = detach;
module.exports.clear = clear;
module.exports.mkdirSync = mkdirSync;
module.exports.getLog = getLog;
module.exports.count = count;
module.exports.random = random;
module.exports.getPageInfo = getPageInfo;
module.exports.renderPage = renderPage;

/**
 ********************************* METHODS *********************************
 */

/**
 * Asynchronously append data to a file, creating the file if it not yet exists.
 * @param {file} String
 * @param {data} String
 */
function writeFile(file, data) {
  'use strict';
  fs.appendFile(file, data, function (err) {
    if (err) return log.error(err);
    log.info('Survey was saved in \'%s\'.', file);
    log.debug(data);
  });
}

/**
 * Returns the number of tabs which are assigned to user view.
 * @param {obj} Object
 * @return {n} Number
 */
function getUserTabs(obj) {
  'use strict';
  if (!obj) return 0;
  var n = 0;
  for (var i in obj) if (obj[i].check) n++;
  return n;
}

/**
 * Returns the number of tabs which are assigned to categories.
 * @param {obj} Object
 * @return {n} Number
 */
function getAssignedTabs(obj) {
  'use strict';
  if (!obj) return 0;
  var n = 0;
  for (var i in obj) n += obj[i].list.length;
  return n;
}

/**
 * Extracts the characters from a string, between two specified indices,
 * (where n is the last one) and returns the new sub string.
 * @param {str} String
 * @param {n} Number
 * @return {str} String
 */
function shorter(str) {
  'use strict';
  if (!str) return false;
  var n = config.custom.shorter.maxLength;
  n = n >= 10 ? n : 42;
  return str.length > n ? str.substring(0, n) + config.custom.shorter.endChars : str;
}

/**
 * Adds new items to the end of an array, and returns the new one.
 * @param {tab} Object
 * @param {cat} Object
 * @return {data} Object
 */
function attach(tab, cat) {
  'use strict';
  if (!cat) return false;
  var data = cat;
  var list = cat.list;
  list.push(tab);
  data.list = list;
  return data;
}

/**
 * Removes items from an array, and returns the new one.
 * @param {id} String
 * @param {cat} Object
 * @return {data} Object
 */
function detach(id, cat) {
  'use strict';
  if (!cat) return false;
  var data = cat;
  var list = cat.list;
  list = list.filter(function (e) {
    return e._id !== id.toString();
  });

  data.list = list;
  return data;
}

/**
 * Tests whether or not the given path exists by checking with the file system
 * and tries to delete the path file.
 * @param {String} id
 */
function clear(filename) {
  'use strict';
  var path = config.custom.upload;

  fs.exists(path + filename, function (exists) {
    if (exists) {
      try {
        fs.unlink(path + filename, function (err) {
          if (err) return log.error(err);
          log.info('Deleted file "%s".', filename);
        });
      } catch (e) {
        log.error(e.stack);
      }
    } else {
      log.warn('Incorrect path "%s" or file "%s" does not exists.', path, filename);
    }
  });
}

/**
 * Creates logging path and file like "mkdir -p", if not exists.
 * @param {String} str
 */
function mkdirSync(str) {
  'use strict';
  var filepath = str.split('/');
  if (filepath.length > 1) {
    var path = '';

    for (var i = 0; i < filepath.length - 1; i++) {
      path = path.concat(filepath[i] + '/');
    }

    fs.exists(path, function (exists) {
      if (!exists) {
        mkdirp.sync(path, parseInt('0755', 8));
        log.verbose('The path for the logfile has been created.');
      } else {
        log.verbose('The path for the logfile already exists.');
      }
    });
  } else {
    log.verbose('No path for the logfile found. Creation skipped.');
  }
}

/**
 * Returns an object with the content of the file as a callback.
 * @param {Function} cb
 */
function getLog(cb) {
  'use strict';
  var arr = [];
  require('readline').createInterface({
    input: fs.createReadStream(config.loggers.log.file.filename),
    output: process.stdout,
    terminal: false,
  }).on('line', function (line) {
    arr.push(JSON.parse(line));
  }).on('close', function () {
    cb(arr);
  });
}

/**
 * Counts the number of documents in a collection.
 * @param {Object} mongoose
 * @param {String} model
 * @param {String} param
 * @param {Object} container
 * @param {Function} cb
 */
function count(mongoose, model, param, container) {
  'use strict';
  var tmp = {};
  tmp[model] = { $regex: new RegExp('(' + param + ')', 'i') };
  mongoose.count(tmp, function (err, count) {
    if (err) return log.error(err);
    container[param].push({ model: model, count: count });
  });
}

/**
 * Returns random string depending on given length.
 * @param {Number} len
 * @return {String} str
 */
function random(len) {
  'use strict';
  var c = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var l = len >= 10 ? len : 24;
  var str = '';

  for (var i = 0; i < l; i++) {
    var n = Math.floor(Math.random() * c.length);
    str = str.concat(c.substring(n, n + 1));
  }

  return str;
}

/**
 * Returns title and icon from given url.
 * @param {String} url
 * @param {Function} cb
 */
function getPageInfo(url, cb) {
  /* jslint browser:true */
  'use strict';
  var phantom = require('phantom');

  // Creates PhantomJS process
  phantom.create().then(function (ph) {
    // Makes new PhantomJS WebPage objects
    return ph.createPage().then(function (page) {
      log.info('PhantomJS was started for evaluation. The process ID is %s.', ph.process.pid);
      if (!url) return ph.exit();

      // Opens the url and loads it to the page
      return page.open(url).then(function (status) {
        if (status === 'success') {
          log.info('Status after opening page "%s": %s', url, status);
        } else {
          log.warn('Status after opening page "%s": %s', url, status);
        }

        return setTimeout(function () {
          // Evaluates the given function in the context
          // of the web page. Execution is sandboxed.
          return page.evaluate(function () {

            var info = {};
            info.title = document.title;
            var links = document.getElementsByTagName('link');

            for (var link in links) {
              try {
                if (links[link].rel.toLowerCase().indexOf('icon') > -1) {
                  info.favicon = links[link].href;
                  return info;
                }
              } catch (e) {
                info.favicon = 'https://plus.google.com/_/favicon?domain_url=' +
                 window.location.origin;
                return info;
              }
            }
          }).then(function (info) {
            cb(info);
            page.close();
            ph.exit();
            log.info('PhantomJS process %s completed and has been terminated.', ph.process.pid);
          });
        }, config.ph.evaluate.delay);
      });
    });
  });
}

/**
 * Captures web page from given url and saves it as an image.
 * @param {Object} obj
 * @param {Function} cb
 */
function renderPage(obj, cb) {
  'use strict';
  var phantom = require('phantom');

  phantom.create(config.ph.settings.clo).then(function (ph) {
    return ph.createPage().then(function (page) {
      log.info('PhantomJS was started for capturing. The process ID is %s.', ph.process.pid);
      if (!obj.url) return ph.exit();

      // Sets the size of the viewport for the layout process
      page.property('viewportSize', config.ph.render.viewport);

      // Defines the rectangular area of the web page to be
      // rasterized when page.render is invoked
      page.property('clipRect', config.ph.render.clip);

      // Specifies the scaling factor
      page.property('zoomFactor', config.ph.render.zoom);

      // Defines whether to execute the script in the page or not
      page.setting('settings.javascriptEnabled', config.ph.settings.javascriptEnabled);

      // Defines whether to load the inlined images or not
      page.setting('settings.loadImages', config.ph.settings.loadImages);

      // Defines whether local resource (e.g. from file) can access remote URLs or not
      page.setting('settings.localToRemoteUrlAccessEnabled',
       config.ph.settings.localToRemoteUrlAccessEnabled);

      // Defines the user agent sent to server when the web page requests resources
      page.setting('settings.userAgent', config.ph.settings.userAgent);

      // Sets the user name used for HTTP authentication
      page.setting('settings.userName', config.ph.settings.userName);

      // Sets the password used for HTTP authentication
      page.setting('settings.password', config.ph.settings.password);

      // Defines whether load requests should be monitored for cross-site scripting attempts
      page.setting('settings.XSSAuditingEnabled', config.ph.settings.XSSAuditingEnabled);

      // Defines whether web security should be enabled or not
      page.setting('settings.webSecurityEnabled', config.ph.settings.webSecurityEnabled);

      // Defines the timeout after which any resource requested will stop trying
      // and proceed with other parts of the page
      page.setting('settings.resourceTimeout', config.ph.settings.resourceTimeout);

      // This callback is invoked when a web page
      // was unable to load resource.
      page.property('onResourceError', function (resourceError) {
        log.error('Resource Error: Unable to load resource (id: #%s | url: %s)',
         resourceError.id, resourceError.url);
        log.error('Resource Error: Error code: %s | Description: %s',
         resourceError.errorCode, resourceError.errorString);
      });

      // This callback is invoked when there is a JavaScript
      // confirm on the web page.
      page.property('onConfirm', function (msg) {
        log.info('JavaScript confirm says: ', msg);

        // true === pressing the OK button
        // false === pressing the Cancel button
        return false;
      });

      // This callback is invoked when a resource requested
      // by the page timeout.
      page.property('onResourceTimeout', function (request) {
        log.warn('Resource Timeout: Response (ID: #%s)', request.id, request);
      });

      return page.open(obj.url).then(function (status) {
        if (status === 'success') {
          log.info('Status after opening page "%s": %s', obj.url, status);
        } else {
          log.warn('Status after opening page "%s": %s', obj.url, status);
        }

        return setTimeout(function () {
          return page.evaluate(function (color) {
            try {
              // Sets background color
              var doc = document;
              doc.body.bgColor = color.defaultWhiteBackground ? '#FFFFFF' :
               color.value ? color.value : '#FFFFFF';
            } catch (e) {
              return;
            }
          }).then(function () {
            // Renders the web page to an image buffer
            // and saves it as the specified filename.
            page.render(config.custom.upload + obj.filename,
             config.ph.render.options).then(function () {
              cb();
              ph.exit();
              log.info('PhantomJS process %s was completed and terminated.', ph.process.pid);
            });
          }, config.ph.render.color);
        }, config.ph.render.delay);
      });
    });
  });
}
