var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Tab = new Schema({
    name: String,
    url: String,
    title: String,
    icon: String,
    check: Boolean,
	whoCreated: String,
	whoUpdated: String,
	whenCreated: Date,
	whenUpdated: Date
});

module.exports = mongoose.model('tab', Tab);
