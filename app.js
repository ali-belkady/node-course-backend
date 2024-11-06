const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

const mongoDbServer = process.env.MONGO_DB_SERVER;
const mongoDbUser = process.env.MONGO_DB_USER;
const mongoDbPass = process.env.MONGO_DB_PASS;

const mongoDbUri = `mongodb+srv://${mongoDbUser}:${mongoDbPass}@${mongoDbServer}/test?retryWrites=true&w=majority`;
const mongoDbClientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};
// console.log('connection :', mongoDbUri);

mongoose
  .connect(mongoDbUri, mongoDbClientOptions)
  .then(() => console.log('Connected successfully to MongoDB!'))
  .catch((error) => console.log('Failed to connect to MongoDB!', error));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  console.log('Received request :', req.method, req.url);
  next();
});

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
