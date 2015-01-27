var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Category = new Schema({
	name: String,
    list: Array
});

module.exports = mongoose.model('category', Category);
