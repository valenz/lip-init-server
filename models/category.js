var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    list: Array,
    whoCreated: String,
    whoUpdated: String,
    whenCreated: Date,
    whenUpdated: Date
});

module.exports = mongoose.model('category', Category);
