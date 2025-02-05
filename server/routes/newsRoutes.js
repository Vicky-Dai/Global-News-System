const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');

// 定义新闻相关路由
router.get('/', newsController.getAllNews); // 获取所有新闻
router.get('/:id', newsController.getNewsById); // 获取单条新闻
router.post('/', authMiddleware, newsController.createNews); // 创建新闻（需要身份验证）

module.exports = router;
 