// Global default settings (run Node without set NODE_ENV)
var config = module.exports = {
  // Environment
  env: 'development',

  // App (required package dependencies)
  app: {
    set: {
      // Sets address where server listen to
      address: '',
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
      favicon: '/public/images/favicon.ico'
    }
  },

  // Database
  db: {
    uri: process.env.MONGO_URI || 'localhost',
    name: '/lipinit'
  },

  // Log levels [silly|debug|verbose|info|warn|error]
  loggers: {
    log: {
      console: {
        level: 'info',
        handleExceptions: true,
        colorize: true,
        timestamp: true,
        prettyPrint: true,
        formatter: true,
        json: false
      },
      file: {
        level: 'info',
        colorize: true,
        timestamp: function() {
          return Date();
        },
        prettyPrint: true,
        formatter: true,
        json: true,
        name: 'log',
        filename: 'logs/log.log'
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
        format: 'jpeg',
        // JPEG compression quality. A higher number will look better, but creates a larger file
        quality: '100',
      },
      // Number of milliseconds to wait after a page loads before taking the screenshot
      delay: 500,
      // When taking the screenshot, adds a white background otherwise adds color.value
      color: {
        defaultWhiteBackground: false,
        value: '#F6F6F6'
      },
      // Specifies the scaling factor
      zoom: 0.4,
      // Defines the rectangular area of the web page to be rasterized
      clip: {
        top: 0,
        left: 0,
        width: 320,
        height: 180
      },
      // Sets the size of the viewport for the layout process
      viewport: {
        width: 320,
        height: 180
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
          'ignore-ssl-errors': false,
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
    upload: 'public/uploads/'
  }
}
