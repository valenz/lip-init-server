# Tabgrid
Save pages in a grid with nodejs.

[![Build Status](https://travis-ci.org/valenz/tabgrid.svg?branch=master)](https://travis-ci.org/valenz/tabgrid)


## Requirements
Default MongoDB service need up and running.


## Installation
### Quick installation
	$ git clone git@github.com:valenz/tabgrid.git

	$ cd tabgrid

	$ npm install

	$ node app

For running your app in background and save all log files into folder 'logs' type:

	$ npm install forever

	$ forever start -p logs/ --minUptime 2000 --spinSleepTime 1000 app.js


## Checking
Finally open your web browser and type:

	http://localhost:9090
