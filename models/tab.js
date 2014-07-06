var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Tab = new Schema({
	tab: String
      , name: String
      , url: String
      , title: String
      , icon: String
      , img: String
});

module.exports = mongoose.model('tabs', Tab);
