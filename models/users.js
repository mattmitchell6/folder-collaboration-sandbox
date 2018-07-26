const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PassportLocalMongoose = require('passport-local-mongoose');
const ERROR = 'user already exists'
// mongoose.Promise = global.Promise; // to supress annoying warning

const BoxSdk = require('../service/box/boxSdk');
const BoxConfig = require('config').boxAppSettings;

let userSchema = new Schema({
  username: String,
  password: String,
  boxId: String
});

userSchema.plugin(PassportLocalMongoose);

/**
 * Create new app user and add user to database
 */
userSchema.statics.newUser = async function (user) {
  let dbUser;
  let newAppUser;
  let username = user.username;
  let serviceAccountClient = BoxSdk.getAppAuthClient('enterprise', BoxConfig.enterpriseID);

  // check if user with submitted name exists
  dbUser = await User.findOne({username: username});
  if(dbUser) {
    throw new Error(ERROR);
  }

  // create Box app user
  newAppUser = await serviceAccountClient.enterprise.addAppUser(username, null);

  // add new user to database
  return new Promise((resolve, reject) => {
    User.register(
      new User({username: user.username, boxId: newAppUser.id}), user.password, function(err, user) {
      if (err) { reject(err); }
      else { resolve(user); }
    });
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;
