const express = require('express');
const httpProxy = require('http-proxy');

// Create a proxy and listen on port 3000
const proxy = httpProxy.createProxyServer({});
const app = express();

app.get('*', function(req, res) {
    // Prints "Request GET https://httpbin.org/get?answer=42"
    console.log('Request', req.method, req.url);
    proxy.web(req, res, { target: `${req.protocol}://${req.hostname}` });
});
const server = await app.listen(3000);

const axios = require('axios');
const res = await axios.get('http://httpbin.org/get?answer=42', {
    // `proxy` means the request actually goes to the server listening
    // on localhost:3000, but the request says it is meant for
    // 'http://httpbin.org/get?answer=42'
    proxy: {
        host: 'localhost',
        port: 3000
    }
});
console.log(res.data);