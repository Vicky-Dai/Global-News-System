const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/xiaomimi',
    createProxyMiddleware({
      target: 'https://m.maoyan.com', 
      changeOrigin: true,
    })
  );
};