const mongoose = require('mongoose');

const regions = new mongoose.Schema({
  id: String,
  title: String,
  value: String
});

module.exports = mongoose.model('Regions', regions);
