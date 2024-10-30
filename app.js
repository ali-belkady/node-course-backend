const express = require('express');
const mongoose = require('mongoose');

const mongoDbServer = process.env.MONGO_DB_SERVER;
const mongoDbUser = process.env.MONGO_DB_USER;
const mongoDbPass = process.env.MONGO_DB_PASS;

const mongoDbUri = `mongodb+srv://${mongoDbUser}:${mongoDbPass}@${mongoDbServer}/?retryWrites=true&w=majority&appName=node-course`;
const mongoDbClientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};
// console.log('connection :', mongoDbUri);
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(mongoDbUri, mongoDbClientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Connected successfully to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}

run().catch(console.dir);



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
  res.status(201).json({
    message: 'Object created!',
  });
});

app.get('/api/stuff', (req, res, next) => {
  const stuff = [
    {
      _id: 'oeihfzeoi',
      title: 'Mon premier objet',
      description: 'Les infos de mon premier objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  console.log('Listing stuff');
  res.status(200).json(stuff);
});

module.exports = app;
