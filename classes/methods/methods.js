var fs = require('fs');
var mkdirp = require('mkdirp');
var winston = require('winston');
var config = require('../../config');
var log = winston.loggers.get('log');

/**
 ********************************* EXPORTS *********************************
 */

module.exports.getAdminTabs = getAdminTabs;
module.exports.getAssignedTabs = getAssignedTabs;
module.exports.shorter = shorter;
module.exports.detach = detach;
module.exports.paste = paste;
module.exports.clear = clear;
module.exports.mkdirSync = mkdirSync;
module.exports.getLog = getLog;
module.exports.random = random;
module.exports.getPageInfo = getPageInfo;
module.exports.renderPage = renderPage;

/**
 ********************************* METHODS *********************************
 */

/**
 * Returns the number of tabs which are assigned to admin view.
 * @param {obj} Object
 * @return {n} Number
 */
function getAdminTabs(obj) {
  if(!obj) return 0;
  var n = 0;
  for(var i in obj) if(obj[i].check) n++;
  return n;
};

/**
 * Returns the number of tabs which are assigned to categories.
 * @param {obj} Object
 * @return {n} Number
 */
function getAssignedTabs(obj) {
  if(!obj) return 0;
  var n = 0;
  for(var i in obj) n += obj[i].list.length;
  return n;
};

/**
 * Extracts the characters from a string, between two specified indices,
 * (where n is the last one) and returns the new sub string.
 * @param {str} String
 * @param {n} Number
 * @return {str} String
 */
function shorter(str, n) {
  if(!str) return false;
  return str.length > n ? str.substring(0, n)+'...' : str;
};

/**
 * Removes items from an array, and returns the new one.
 * @param {str} String
 * @param {obj} Object
 * @return {data} Object
 */
function detach(str, obj) {
  if(!obj) return false;
  var data = obj;
  var list = obj.list;
  var index = list.indexOf(str);
  if(index == -1) return false;
  list.splice(index, 1);
  data.list = list;
  return data;
};

/**
 * Adds new items to the end of an array, and returns the new one.
 * @param {str} String
 * @param {obj} Object
 * @return {data} Object
 */
function paste(str, obj) {
  if(!obj) return false;
  var data = obj;
  var list = obj.list;
  list.push(str);
  data.list = list;
  return data;
};

/**
 * Tests whether or not the given path exists by checking with the file system
 * and tries to delete the path file.
 * @param {String} id
 */
function clear(filename) {
  var path = config.custom.upload;

  fs.exists(path + filename, function(exists) {
    if(exists) {
      try {
        fs.unlink(path + filename, function(err) {
          if(err) return log.error(err);
          log.info('Deleted file "%s".', filename);
        });
      } catch(e) {
        log.error(e.stack);
      }
    } else {
      log.warn('Incorrect path "%s" or file "%s" does not exists.', path, filename);
    }
  });
};

/**
 * Creates logging path and file like "mkdir -p", if not exists.
 * @param {String} str
 */
function mkdirSync(str) {
  var filepath = str.split('/');
  if(filepath.length > 1) {
    var path = '';

    for(var i = 0; i < filepath.length-1; i++) {
      path = path.concat(filepath[i]+'/');
    }

    fs.exists(path, function(exists) {
      if(!exists) {
        mkdirp.sync(path, 0755)
        log.verbose('The path and filename of the logfile has been created.');
      } else {
        log.verbose('The path and filename of the logfile already exists.');
      }
    });
  } else {
    log.verbose('No path of the logfile found. Creation skipped.');
  }
};

/**
 * Returns an object with the content of the file as a callback.
 * @param {Function} cb
 * @return {Object} l
 */
function getLog(cb) {
  var arr = new Array();
  require('readline').createInterface({
    input: fs.createReadStream(config.loggers.log.file.filename),
    output: process.stdout,
    terminal: false
  }).on('line', function(line) {
    arr.push(JSON.parse(line));
  }).on('close', function() {
    cb(arr);
  });
};

/**
 * Returns random string depending on given length.
 * @param {String} len
 * @return {String} str
 */
function random(len) {
  var c = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var l = len ? len : 24;
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
 * @return {Function} cb
 */
function getPageInfo(url, cb) {
  var phantom = require('phantom');

  // Creates PhantomJS process
  phantom.create(function(ph) {
    // Makes new PhantomJS WebPage objects
    return ph.createPage(function(page) {
      log.info('PhantomJS was started for evaluation. The process ID is %s.', ph.process.pid);
      if(!url) return ph.exit();

      // Opens the url and loads it to the page
      return page.open(url, function(status) {
        if(status === 'success') {
          log.info('Status after opening page "%s": %s', url, status)
        } else {
          log.warn('Status after opening page "%s": %s', url, status);
        }

        return setTimeout(function() {
          // Evaluates the given function in the context
	        // of the web page. Execution is sandboxed.
          return page.evaluate(function() {

            var info = new Object();
            info.title = document.title;
            var links = document.getElementsByTagName('link');

            for(var link in links) {
              try {
                if(links[link].rel.toLowerCase().indexOf('icon') > -1) {
                  info.favicon = links[link].href;
                  return info;
                }
              } catch(e) {
                info.favicon = 'https://plus.google.com/_/favicon?domain_url='+ window.location.origin;
                return info;
              }
            }
          }, function(info) {
            cb(info);
            ph.exit();
            log.info('PhantomJS process %s complete and was terminated.', ph.process.pid);
          });
        }, config.ph.evaluate.delay);
      });
    });
  });
};

/**
 * Captures web page from given url and saves it as an image.
 * @param {Object} obj
 * @return {Function} cb
 */
function renderPage(obj, cb) {
  var phantom = require('phantom');

  phantom.create(config.ph.settings.clo, function (ph) {
    return ph.createPage(function (page) {
      log.info('PhantomJS was started for capturing. The process ID is %s.', ph.process.pid);
      if(!obj.url) return ph.exit();

      // Sets the size of the viewport for the layout process
      page.set('viewportSize', config.ph.render.viewport);
      // Defines the rectangular area of the web page to be
      // rasterized when page.render is invoked
      page.set('clipRect', config.ph.render.clip);
      // Specifies the scaling factor
      page.set('zoomFactor', config.ph.render.zoom);

      // Defines whether to execute the script in the page or not
      page.set('settings.javascriptEnabled', config.ph.settings.javascriptEnabled);
      // Defines whether to load the inlined images or not
      page.set('settings.loadImages', config.ph.settings.loadImages);
      // Defines whether local resource (e.g. from file) can access remote URLs or not
      page.set('settings.localToRemoteUrlAccessEnabled', config.ph.settings.localToRemoteUrlAccessEnabled);
      // Defines the user agent sent to server when the web page requests resources
      page.set('settings.userAgent', config.ph.settings.userAgent);
      // Sets the user name used for HTTP authentication
      page.set('settings.userName', config.ph.settings.userName);
      // Sets the password used for HTTP authentication
      page.set('settings.password', config.ph.settings.password);
      // Defines whether load requests should be monitored for cross-site scripting attempts
      page.set('settings.XSSAuditingEnabled', config.ph.settings.XSSAuditingEnabled);
      // Defines whether web security should be enabled or not
      page.set('settings.webSecurityEnabled', config.ph.settings.webSecurityEnabled);
      // Defines the timeout after which any resource requested will stop trying
      // and proceed with other parts of the page
      page.set('settings.resourceTimeout', config.ph.settings.resourceTimeout);

      // This callback is invoked when a web page
      // was unable to load resource.
      page.set('onResourceError', function(resourceError) {
        log.error('Resource Error: Unable to load resource (id: #%s | url: %s)', resourceError.id, resourceError.url);
        log.error('Resource Error: Error code: %s | Description: %s', resourceError.errorCode, resourceError.errorString);
      });

      // This callback is invoked when there is a JavaScript
      // confirm on the web page.
      page.set('onConfirm', function(msg) {
        log.info('JavaScript confirm says: ', msg);
        // true === pressing the OK button
        // false === pressing the Cancel button
        return false;
      });

      // This callback is invoked when a resource requested
      // by the page timeout.
      page.set('onResourceTimeout', function(request) {
        log.warn('Resource Timeout: Response (ID: #%s)', request.id, request);
      });

      return page.open(obj.url, function (status) {
        if(status === 'success') {
          log.info('Status after opening page "%s": %s', obj.url, status)
        } else {
          log.warn('Status after opening page "%s": %s', obj.url, status);
        }

        return setTimeout(function() {
          return page.evaluate(function(color) {
            try {
              // Sets background color
              document.body.bgColor = color.defaultWhiteBackground ? '#FFFFFF' : color.value ? color.value : '#FFFFFF';
            } catch(e) {
              return;
            }
          }, function() {
            // Renders the web page to an image buffer
	          // and saves it as the specified filename.
            page.render(config.custom.upload + obj.filename, config.ph.render.options, function() {
              cb();
              ph.exit();
              log.info('PhantomJS process %s complete and was terminated.', ph.process.pid);
            });
          }, config.ph.render.color);
        }, config.ph.render.delay);
      });
    });
  });
};
