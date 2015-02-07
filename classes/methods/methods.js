var fs = require('fs');
var uploadPath = 'public/uploads/';

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
 * @param {Object} req
 * @param {Object} res
 * @return {String} err
 */
function clear(req) {
  var file = req.body.id +'.png';

  fs.exists(uploadPath + file, function(exists) {
    if(exists) {
      try {
        fs.unlink(uploadPath + file, function(err) {
          if(err) {
            req.flash('error', err);
            return console.error(err);
          }

          console.log('DELETE.FILE: '+ req.body.id);
        });
      } catch(e) {
        console.error(e.stack);
        req.flash('error', e.message);
      }
    } else {
      console.error('Incorrect path "'+ path +'" or file "'+ file +'" does not exists.');
      req.flash('note', 'Incorrect path "'+ path +'" or file "'+ file +'" does not exists.');
    }
  });
};

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

      // Opens the url and loads it to the page
      return page.open(url, function(status) {
        console.log("PAGE.INFO.URL.STATUS: ", status);

        return setTimeout(function() {
          // Evaluates the given function in the context of the web page. Execution is sandboxed.
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
                console.error(e.stack);
                return info;
              }
            }
          }, function(info) {
            cb(info);
            ph.exit();
          });
        }, 500);
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

  phantom.create('--ignore-ssl-errors=true', '--ssl-protocol=any', '--web-security=false', '--output-encoding=utf8', function (ph) {
    return ph.createPage(function (page) {
      console.log('PAGE.RENDER.PHANTOM.PROCESS.PID:', ph.process.pid);

      page.set('settings.javascriptEnabled', true);
      page.set('settings.resourceTimeout', 30 * 1000); // timeout 30 seconds
      // defines the rectangular area of the web page to be rasterized when page.render is invoked
      page.set('clipRect', { top: 0, left: 0, width: 960, height: 540});
      // sets the size of the viewport for the layout process
      page.set('viewportSize', { width: 960, height: 540 });

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

      // This callback is invoked when a resource requested by the page timeout.
      page.set('onResourceTimeout', function(request) {
        console.log('ON.RESOURCE.TIMEOUT: Response (ID: #'+ request.id +'): '+ JSON.stringify(request));
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

      return page.open(obj.url, function (status) {
        console.log("PAGE.RENDER.URL.STATUS: ", status);

        return setTimeout(function() {
          return page.evaluate(function() {
            // Sets background color
            document.body.bgColor = '#F6F6F6';
          }, function() {
            // Renders the web page to an image buffer and saves it as the specified filename.
            page.render(uploadPath + obj.filename, function() {
              cb();
              ph.exit();
            });
          });
        }, 1000);
      });
    });
  });
};
