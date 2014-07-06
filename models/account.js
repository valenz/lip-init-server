var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , plm = require('passport-local-mongoose');

var Account = new Schema({
        username: String
      , password: String
});

Account.plugin(plm, {usernameLowerCase:true, incorrectPasswordError:'Incorrect username or password', incorrectUsernameError:'Incorrect username or password'});

module.exports = mongoose.model('accounts', Account);
