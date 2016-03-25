var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  uid: String,
  role: Number,
  whoCreated: String,
  whoUpdated: String,
  whenCreated: Date,
  whenUpdated: Date,
});

Account.plugin(passportLocalMongoose, {
  //saltlen: 32,
  //iterations: 25000,
  //keylen: 512,
  //interval: 100,
  //usernameField: 'username',
  //usernameUnique: true,
  //saltField: 'salt',
  //hashField: 'hash',
  //attemptsField: 'attempts',
  //lastLoginField: 'last',
  //selectFields: 'undefined',
  usernameLowerCase: true,

  //populateFields: 'undefined',
  //encoding: 'hex',
  //limitAttempts: false,
  //incorrectPasswordError: 'Incorrect password',
  //incorrectUsernameError: 'Incorrect username',
  //missingUsernameError: 'Field %s is not set',
  //missingPasswordError: 'Password argument not set!',
  //userExistsError: 'User already exists with name %s',
  //noSaltValueStored: 'Authentication not possible. No salt value stored in mongodb collection!'
});

module.exports = mongoose.model('account', Account);
