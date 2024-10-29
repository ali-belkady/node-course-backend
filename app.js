const express = require('express');

const app = express();

app.use((req, res) => {
  res.json({ message: 'Generic response!' });
});

module.exports = app;
