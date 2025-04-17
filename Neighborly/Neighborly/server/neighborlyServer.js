const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Serve service data from JSON file
app.get('/api/services', (req, res) => {
  const services = require('../data/albertaServices.json');
  res.json(services);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Neighborly server running at http://localhost:${PORT}`);
});