const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware to handle CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Proxy endpoint
app.use('/proxy', createProxyMiddleware({
    target: 'https://cstest.travtech.com', // The target server
    changeOrigin: true, // Change the origin of the host header to the target URL
    pathRewrite: {
        '^/proxy': '', // Remove "/proxy" from the request path
    },
    onProxyRes: (proxyRes, req, res) => {
        // Ensure CORS headers are added to the proxied response
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server is running at http://localhost:${PORT}`);
});
