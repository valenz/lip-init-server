var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Category = new Schema({
    list: Array
});

module.exports = mongoose.model('category', Category);
