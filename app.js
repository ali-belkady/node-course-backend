const express = require('express');
const mongoose = require('mongoose');
const Thing = require('./models/thing');

const mongoDbServer = process.env.MONGO_DB_SERVER;
const mongoDbUser = process.env.MONGO_DB_USER;
const mongoDbPass = process.env.MONGO_DB_PASS;

const mongoDbUri = `mongodb+srv://${mongoDbUser}:${mongoDbPass}@${mongoDbServer}/test?retryWrites=true&w=majority&appName=node-course`;
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

app.post('/api/stuff', (req, res, next) => {
  console.log(req.body);
  delete req.body._id;
  const thing = new Thing({
    ...req.body,
  });
  thing
    .save()
    .then(() => {
      res.status(201).json({ message: 'Thing created!' });
      console.log('Thing created!');
    })
    .catch((error) => {
      res.status(400).json({ error });
      console.log('Thing creation failed!', error);
    });
});

app.get('/api/stuff', (req, res, next) => {
  Thing.find()
    .then((things) => {
      res.status(200).json(things);
      console.log('Listing things');
    })
    .catch((error) => {
      res.status(400).json({ error });
      console.log('Things listing failed!', error);
    });
});

app.get('/api/stuff/:id', (req, res, next) => {
  const requestedId = req.params.id;

  Thing.findOne({ _id: requestedId })
    .then((thing) => {
      res.status(200).json(thing);
      console.log('Found thing with id', requestedId);
    })
    .catch((error) => {
      res.status(404).json({ error });
      console.log(`Thing with id ${requestedId} not found!`, error);
    });
});

app.put('/api/stuff/:id', (req, res, next) => {
  const requestedId = req.params.id;

  Thing.updateOne({ _id: requestedId }, { ...req.body, _id: requestedId })
    .then((thing) => {
      res.status(200).json(thing);
      console.log('Modified thing with id', requestedId);
    })
    .catch((error) => {
      res.status(404).json({ error });
      console.log(`Thing with id ${requestedId} update failed!`, error);
    });
});

app.delete('/api/stuff/:id', (req, res, next) => {
  const requestedId = req.params.id;

  Thing.deleteOne({ _id: requestedId })
    .then((thing) => {
      res.status(200).json(thing);
      console.log('removed thing with id', requestedId);
    })
    .catch((error) => {
      res.status(404).json({ error });
      console.log(`Thing with id ${requestedId} removal failed!`, error);
    });
});

module.exports = app;
