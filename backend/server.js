const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse raw body for upload
app.use(express.raw({ type: 'application/octet-stream', limit: '350mb' }));

// For download, serve a large file
app.get('/download', (req, res) => {
  const sizeMB = parseInt(req.query.size) || 100;
  const size = sizeMB * 1024 * 1024;
  const buffer = Buffer.alloc(size, 'a'); // fill with 'a'
  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Length': size,
    'Content-Disposition': 'attachment; filename="test.bin"'
  });
  res.send(buffer);
});

// For upload, accept POST and measure speed
app.post('/upload', (req, res) => {
  const receivedBytes = req.body.length;
  const startTime = parseInt(req.headers['x-start-time']);
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  const speed = (receivedBytes * 8 / duration / 1000000).toFixed(2); // Mbps
    res.json({ speed: speed });
});

app.listen(port, () => {
  console.log(`Speed test backend listening at http://localhost:${port}`);
});