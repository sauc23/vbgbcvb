const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve the index.html file at the root URL "/"
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Emulate audio streaming for /stream and /stream2
app.get('/stream', (req, res) => {
  res.redirect('https://stream-relay-geo.ntslive.net/stream');
});

app.get('/stream2', (req, res) => {
  res.redirect('https://stream-relay-geo.ntslive.net/stream2');
});

// Add an API route to fetch data from nts.live/api/v2/live
app.get('/api', (req, res) => {
  // You can use Express's built-in JSON method to make the API request.

  const https = require('https');
  const options = {
    host: 'nts.live',
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
        res.json(apiData);
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
