var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Set = new Schema({
	login: Boolean
});

module.exports = mongoose.model('settings', Set);
