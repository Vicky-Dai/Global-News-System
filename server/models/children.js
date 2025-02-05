const mongoose = require('mongoose');

const children = new mongoose.Schema({
  id: String,
  title: String,
  rightId: String,
  key: String,
  grade: Number
});

module.exports = mongoose.model('Children', children);
