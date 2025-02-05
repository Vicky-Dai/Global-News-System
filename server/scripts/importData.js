/* 将原先JSON数据导入mongoDB */
const mongoose = require('mongoose');
const data = require('../../db/db.json'); // 导入 db.json 数据
const User = require('../models/users');
const Role = require('../models/roles');
const Right = require('../models/rights');
const Category = require('../models/categories');
const Region = require('../models/regions');
const News = require('../models/news');
const Children = require('../models/children');

const uri = "mongodb+srv://Vicky-Dai:Ji4z3zESqes5gap6@mars.nr9dh.mongodb.net/?retryWrites=true&w=majority&appName=Mars"; // 替换为你的 MongoDB URI

// 分批插入数据的函数
async function insertDataInBatches(data, model, batchSize = 100) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    await model.insertMany(batch);
    console.log(`Inserted batch ${i / batchSize + 1}`);
  }
}

async function importData() {
  try {
    // 连接到 MongoDB
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // 批量插入用户数据
    if (data.users && data.users.length > 0) {
      await insertDataInBatches(data.users, User);
      console.log('All users imported');
    }

    // 批量插入角色数据
    if (data.roles && data.roles.length > 0) {
      await insertDataInBatches(data.roles, Role);
      console.log('All roles imported');
    }

    // 批量插入权限数据
    if (data.rights && data.rights.length > 0) {
      await insertDataInBatches(data.rights, Right);
      console.log('All rights imported');
    }

    // 批量插入类别数据
    if (data.categories && data.categories.length > 0) {
      await insertDataInBatches(data.categories, Category);
      console.log('All categories imported');
    }

    // 批量插入区域数据
    if (data.regions && data.regions.length > 0) {
      await insertDataInBatches(data.regions, Region);
      console.log('All regions imported');
    }

    // 批量插入新闻数据
    if (data.news && data.news.length > 0) {
      await insertDataInBatches(data.news, News);
      console.log('All news imported');
    }

    // 批量插入新闻数据
    if (data.children && data.children.length > 0) {
      await insertDataInBatches(data.children, Children);
      console.log('All children imported');
    }

  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    // 确保连接关闭
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

importData();
