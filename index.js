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

// ...

// Add an API route to fetch data from nts.live/api/v2/live
app.get('/api', (req, res) => {
  // You can use a library like axios or node-fetch to make the API request.
  // Here, we'll use node-fetch as an example.

  const fetch = require('node-fetch');

  fetch('https://nts.live/api/v2/live')
    .then(response => response.json())
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch NTS data' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
