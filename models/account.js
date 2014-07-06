var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , plm = require('passport-local-mongoose');

var Account = new Schema({
        username: String
      , password: String
});

Account.plugin(plm);

module.exports = mongoose.model('accounts', Account);
