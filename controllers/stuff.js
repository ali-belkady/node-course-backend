const fs = require('fs');

const Thing = require('../models/thing');

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

exports.createThing = (req, res, next) => {
  // the body is under a sub-object as a string, bacause a file has been sent to multer
  const thingObject = JSON.parse(req.body.thing);

  delete thingObject._id;
  delete thingObject._userId;

  const thing = new Thing({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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

exports.modifyThing = (req, res, next) => {
  const connectedUserId = req.auth.userId;
  const requestedId = req.params.id;
  const thingObject = req.file
    ? {
        // a file exits, the body is an sub-object as a string
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : {
        // no file found, the body can be parsed directly
        // the image has not been modified in the frontend
        ...req.body,
      };

  delete thingObject._userId;

  Thing.findOne({ _id: requestedId })
    .then((thing) => {
      if (thing.userId != connectedUserId) {
        res.status(401).json({ message: 'Not authorized' });
        console.log('User', connectedUserId, 'Not authorized to modify thing with id', requestedId);
      } else {
        const oldFilename = thing.imageUrl.split('/images/')[1];

        Thing.updateOne({ _id: requestedId }, { ...thingObject, _id: requestedId })
          .then(() => {
            res.status(200).json(thing);
            console.log('Modified thing with id', requestedId);
            if (req.file) {
              // remove previous image after update
              // not a blocking step that serves as a cleanup for server side
              fs.unlink(`images/${oldFilename}`, () => {});
            }
          })
          .catch((error) => {
            res.status(401).json({ error });
            console.log(`Thing with id ${requestedId} update failed!`, error);
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
      console.log(`Thing with id ${requestedId} not found!`, error);
    });
};

exports.deleteThing = (req, res, next) => {
  const connectedUserId = req.auth.userId;
  const requestedId = req.params.id;

  Thing.findOne({ _id: requestedId })
    .then((thing) => {
      if (thing.userId != connectedUserId) {
        res.status(401).json({ message: 'Not authorized' });
        console.log('User', connectedUserId, 'Not authorized to delete thing with id', requestedId);
      } else {
        const filename = thing.imageUrl.split('/images/')[1];

        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: requestedId })
            .then((thing) => {
              res.status(200).json(thing);
              console.log('Removed thing with id', requestedId);
            })
            .catch((error) => {
              res.status(500).json({ error });
              console.log(`Thing with id ${requestedId} removal failed!`, error);
            });
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
      console.log(`Thing with id ${requestedId} not found!`, error);
    });
};
