const newsService = require('../services/newsService');

// 获取所有新闻
const getAllNews = async (req, res) => {
    try {
        const news = await newsService.getAllNews();
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
};

// 获取单条新闻
const getNewsById = async (req, res) => {
    try {
        const news = await newsService.getNewsById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: '新闻未找到' });
        }
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
};

// 创建新闻
const createNews = async (req, res) => {
    try {
        const newNews = await newsService.createNews(req.body);
        res.status(201).json(newNews);
    } catch (error) {
        res.status(500).json({ message: '服务器错误', error });
    }
};

module.exports = { getAllNews, getNewsById, createNews };
