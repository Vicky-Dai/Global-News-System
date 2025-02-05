const mongoose = require('mongoose');

const users = new mongoose.Schema({
  id: String,
  username: String,
  password: String,
  roleState: Boolean,
  default: Boolean,
  region: String,
  roleId: String
});

module.exports = mongoose.model('Users', users);
