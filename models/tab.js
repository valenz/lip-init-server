var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tab = new Schema({
  name: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  renderUrl: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  check: Boolean,
  category: String,
  prefer: Number,
  whoCreated: String,
  whoUpdated: String,
  whenCreated: Date,
  whenUpdated: Date
});

module.exports = mongoose.model('tab', Tab);
