const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/media',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      logLevel: 'debug'
    })
  );

  app.use(
      '/profile',
      createProxyMiddleware({
          target: 'http://localhost:8000',
          changeOrigin: true,
          logLevel: 'debug'
      })
  )
};