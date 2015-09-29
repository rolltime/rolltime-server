var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

//
// User schema for Mongo.
//
var UserSchema = mongoose.Schema({
  local: {
    name: String,
    zipcode: [],
    phone: String,
    email: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }

})

//
// Hashing passwords at all times.
//
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

//
// Checking if password is valid with bcrypt.
//
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

//
// Register the model with Mongo
// and export it to the application.
//
module.exports = mongoose.model('User', UserSchema)
