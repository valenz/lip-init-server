var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    list: Array
});

module.exports = mongoose.model('category', Category);
