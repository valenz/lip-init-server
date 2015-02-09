var fs = require('fs');
var config = require('../../config');

/**
 ********************************* EXPORTS *********************************
 */

module.exports.logout = logout;
module.exports.getAdminTabs = getAdminTabs;
module.exports.getAssignedTabs = getAssignedTabs;
module.exports.shorter = shorter;
module.exports.detach = detach;
module.exports.paste = paste;
module.exports.clear = clear;
module.exports.random = random;
module.exports.getPageInfo = getPageInfo;
module.exports.renderPage = renderPage;

/**
 ********************************* METHODS *********************************
 */

/**
 * Set a flash message by passing the key, followed by the value, to req.flash()
 * and remove the req.user property and clear the login session.
 * @param {Object} req
 * @param {Object} res
 */
function logout(req, res) {
  req.flash('success', 'You are logged out.');
  req.logout();
};

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
          if(err) return console.error(err);
          console.log('DELETE.FILE: ', filename);
        });
      } catch(e) {
        console.error(e.stack);
      }
    } else {
      console.error('Incorrect path "'+ path +'" or file "'+ filename +'" does not exists.');
    }
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
      console.log('PAGE.INFO.PHANTOM.PROCESS.PID:', ph.process.pid);
      if(!url) return ph.exit(1);

      // Opens the url and loads it to the page
      return page.open(url, function(status) {
        console.log("PAGE.INFO.URL.STATUS: ", status);

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
                console.error(e.stack);
                info.favicon = 'https://plus.google.com/_/favicon?domain_url='+ window.location.origin;
                return info;
              }
            }
          }, function(info) {
            cb(info);
            ph.exit();
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
      console.log('PAGE.RENDER.PHANTOM.PROCESS.PID:', ph.process.pid);
      if(!obj.url) return ph.exit(1);

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
        console.log('ON.RESOURCE.ERROR: Unable to load resource (ID: #'+ resourceError.id +' URL: '+ resourceError.url +')');
        console.log('ON.RESOURCE.ERROR: Error code: '+ resourceError.errorCode +'. Description: '+ resourceError.errorString);
      });

      // This callback is invoked when there is a JavaScript
      // confirm on the web page.
      page.set('onConfirm', function(msg) {
        console.log('ON.CONFIRM: '+ msg);
        // true === pressing the OK button
        // false === pressing the Cancel button
        return false;
      });

      // This callback is invoked when a resource requested
      // by the page timeout.
      page.set('onResourceTimeout', function(request) {
        console.log('ON.RESOURCE.TIMEOUT: Response (ID: #'+ request.id +'): '+ JSON.stringify(request));
      });

      return page.open(obj.url, function (status) {
        console.log("PAGE.RENDER.URL.STATUS: ", status);

        return setTimeout(function() {
          return page.evaluate(function(color) {
            try {
              // Sets background color
              document.body.bgColor = color.defaultWhiteBackground ? '#FFFFFF' : color.value ? color.value : '#FFFFFF';
            } catch(e) {
              return console.error(e.stack);
            }
          }, function() {
            // Renders the web page to an image buffer
	          // and saves it as the specified filename.
            page.render(config.custom.upload + obj.filename, { format: config.ph.render.format, quality: config.ph.render.quality }, function() {
              cb();
              ph.exit();
            });
          }, config.ph.render.color);
        }, config.ph.render.delay);
      });
    });
  });
};
