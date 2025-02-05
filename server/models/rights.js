const mongoose = require('mongoose');

const rights = new mongoose.Schema({
  id: String,
  title: String,
  key: String,
  pagepermisson: Number,
  grade: Number
});

module.exports = mongoose.model('Rights', rights);
