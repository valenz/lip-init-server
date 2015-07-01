// Global default settings (run Node without set NODE_ENV)
var config = module.exports = {
  // Environment
  env: 'development',

  // App (required package dependencies)
  app: {
    set: {
      // Sets address where server listen to
      address: 'localhost',

      // Sets port where server listen to
      port: 9002,

      // Sets location of view pages
      views: '/views',

      // Sets view render engine
      engine: 'jade',

      // Sets view options
      options: {
        layout: false
      },

      // Sets location of static client side content
      static: 'public',

      // Sets location of the favicon
      favicon: '/public/images/favicon.ico',

      // Sets options for request logging
      morgan: ':locale - \x1b[32minfo\x1b[0m: [:package] :method :url :status \x1b[0m:response-time ms | :res[content-length] | :remote-addr :remote-user HTTP/:http-version | :user-agent'
    },
    cookie: {
      options: {

        // Name of the session ID cookie to set in the response
        key: 'TGID',

        // The secret used to sign the session ID cookie
        secret: 'keyboard cat',

        // Forces the session to be saved back to the session store,
        // even if the session was never modified during the request
        resave: false,

        // Forces a session that is "uninitialized" to be saved to the store
        saveUninitialized: true,
        cookie: {
          path: '/',
          httpOnly: true,

          // Requires an https-enabled website, i.e., HTTPS is necessary for secure cookies
          secure: false,

          // By default cookie.maxAge is null, meaning no "expires" parameter is set
          // so the cookie becomes a browser-session cookie. When the user closes the
          // browser the cookie (and session) will be removed.
          maxAge: 60 * 60 * 1000 // one hour
        },

        // Force a cookie to be set on every response. This resets the expiration date
        rolling: true
      },
      store: {}
    }
  },

  // Database
  db: {
    uri: 'localhost',
    name: '/tabgrid'
  },

  // Log levels [silly|debug|verbose|info|warn|error]
  loggers: {
    log: {
      file: {
        // Level of messages that this transport should log
        level: 'info',

        // Boolean flag indicating if we should colorize output
        colorize: true,

        // Boolean flag indicating if we should prepend output with timestamps
        // If function is specified, its return value will be used instead of timestamps
        timestamp: function() {
          return new Date().toISOString().substr(0, 11) + new Date().toLocaleTimeString();
        },

        // If true, additional JSON metadata objects that are added to
        // logging string messages will be displayed as a JSON string representation
        // If function is specified, its return value will be the string representing the meta
        prettyPrint: true,

        // If function is specified, its return value will be used instead of default output
        formatter: true,

        // If true, messages will be logged as JSON
        json: true,

        // The filename of the logfile to write output to
        filename: 'logs/log.log',

        // Max size in bytes of the logfile, if the size is exceeded then a
        // new file is created, a counter will become a suffix of the log file
        maxsize: 512 * 1024,

        // Limit the number of files created when the size of the logfile is exceeded
        maxFiles: 1,

        // If true, log files will be rolled based on maxsize and maxfiles, but in ascending order
        // The filename will always have the most recent log lines
        // The larger the appended number, the older the log file
        tailable: true
      },
      console: {
        level: 'info',
        handleExceptions: true,
        colorize: true,
        timestamp: function() {
          return new Date().toISOString().substr(0, 11) + new Date().toLocaleTimeString();
        },

        prettyPrint: true,
        formatter: true,
        json: false
      }
    }
  },

  // PhantomJS settings
  // For further informations check:
  // https://www.npmjs.com/package/phantom
  // http://phantomjs.org/api/command-line.html
  // http://phantomjs.org/api/webpage/property/settings.html
  ph: {
    render: {
      options: {
        // Renders the web page to an image buffer [PNG|GIF|JPEG|PDF]
        format: 'png',

        // JPEG compression quality. A higher number will look better, but creates a larger file
        quality: '100'
      },

      // Number of milliseconds to wait after a page loads before taking the screenshot
      delay: 500,

      // When taking the screenshot, adds a white background otherwise adds color.value
      color: {
        defaultWhiteBackground: false,
        value: '#F6F6F6'
      },

      // Specifies the scaling factor
      zoom: 0.8,

      // Defines the rectangular area of the web page to be rasterized
      clip: {
        top: 0,
        left: 0,
        width: 640,
        height: 360
      },

      // Sets the size of the viewport for the layout process
      viewport: {
        width: 640,
        height: 360
      }
    },
    evaluate: {
      // Number of milliseconds to wait after a page evaluates before returns sandboxed content
      delay: 100
    },
    settings: {
      clo: {
        parameters: {
          // Ignores SSL errors, such as expired or self-signed certificate errors
          'ignore-ssl-errors': true,

          // Sets the SSL protocol for secure connections
          'ssl-protocol': 'any',

          // Sets the encoding used for terminal output
          'output-encoding': 'utf8',

          // Sets the encoding used for the starting script
          'script-encoding': 'utf8'
        }
      },

      // Defines whether to execute the script in the page or not
      javascriptEnabled: true,

      // Defines whether to load the inlined images or not
      loadImages: true,

      // Defines whether local resource (e.g. from file) can access remote URLs or not
      localToRemoteUrlAccessEnabled: false,

      // Defines the user agent sent to server when the web page requests resources
      userAgent: '',

      // Sets the user name used for HTTP authentication
      userName: '',

      // Sets the password used for HTTP authentication
      password: '',

      // Defines whether load requests should be monitored for cross-site scripting attempts
      XSSAuditingEnabled: false,

      // Defines whether web security should be enabled or not
      webSecurityEnabled: false,

      // Defines the timeout after which any resource requested will stop trying
      // and proceed with other parts of the page
      resourceTimeout: 30 * 1000
    }
  },

  // Custom
  custom: {
    searchModels: ['name', 'title', 'category'],
    upload: 'public/uploads/',
    shorter: {
      maxLength: 48,
      endChars: '...'
    }
  }
};
