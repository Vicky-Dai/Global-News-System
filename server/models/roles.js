const mongoose = require('mongoose');

const roles = new mongoose.Schema({
  id: String,
  roleName: String,
  roleType: Number,
  rights: [String],
});

module.exports = mongoose.model('Roles', roles);
