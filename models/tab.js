var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Tab = new Schema({
    name: String,
    title: String,
    url: String,
    icon: String,
    check: Boolean,
	category: String,
    whoCreated: String,
    whoUpdated: String,
    whenCreated: Date,
    whenUpdated: Date
});

module.exports = mongoose.model('tab', Tab);
