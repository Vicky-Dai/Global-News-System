const mongoose = require('mongoose');

const categories = new mongoose.Schema({
  id: String,
  title: String,
  value: String
});

module.exports = mongoose.model('Categories', categories);
