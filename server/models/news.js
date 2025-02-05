const mongoose = require('mongoose');

const news = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  categoryId: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  roleId: {
    type: String,
    required: true,
  },
  auditState: {
    type: Number,
    required: true,
  },
  publishState: {
    type: Number,
    required: true,
  },
  createTime: {
    type: Number,
    required: true,
  },
  star: {
    type: Number,
    required: true,
  },
  view: {
    type: Number,
    required: true,
  },
  id: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('News', news);
// db.json里面有news啊为什么导入不进来