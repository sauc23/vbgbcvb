const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = process.env.PORT || 3000;

// Serve the index.html file at the root URL "/"
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Emulate audio streaming for /stream and /stream2 using an HTTP proxy
app.use('/stream', createProxyMiddleware({
  target: 'https://stream-relay-geo.ntslive.net',
  changeOrigin: true,
  pathRewrite: { '^/stream': '/stream' },
}));

app.use('/stream2', createProxyMiddleware({
  target: 'https://stream-relay-geo.ntslive.net',
  changeOrigin: true,
  pathRewrite: { '^/stream2': '/stream2' },
}));

// Add an API route to fetch data from nts.live/api/v2/live
app.get('/api', (req, res) => {
  const https = require('https');
  const options = {
    host: 'https://nts.live',
    path: '/api/v2/live',
  };

  https.get(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const apiData = JSON.parse(data);
        res.json(apiData.results[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch NTS data' });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
