const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  level: String,
  lastAccess: String,
  registrationDate: String,
  sugestoesAceites: Number,
  _id: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema)