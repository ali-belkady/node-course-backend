const Thing = require('../models/thing');

exports.createThing = (req, res, next) => {
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
};

exports.getAllStuff = (req, res, next) => {
  Thing.find()
    .then((things) => {
      res.status(200).json(things);
      console.log('Listing things');
    })
    .catch((error) => {
      res.status(400).json({ error });
      console.log('Things listing failed!', error);
    });
};

exports.getOneThing = (req, res, next) => {
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
};

exports.modifyThing = (req, res, next) => {
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
};

exports.deleteThing = (req, res, next) => {
  const requestedId = req.params.id;

  Thing.deleteOne({ _id: requestedId })
    .then((thing) => {
      res.status(200).json(thing);
      console.log('Removed thing with id', requestedId);
    })
    .catch((error) => {
      res.status(404).json({ error });
      console.log(`Thing with id ${requestedId} removal failed!`, error);
    });
};
