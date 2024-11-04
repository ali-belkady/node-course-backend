const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const jwtSecretKey = process.env.JWT_SECRET_KEY;

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({ message: 'User created!' });
          console.log('User created!');
        })
        .catch((error) => {
          res.status(400).json({ error });
          console.log('User creation failed!', error);
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
      console.log('Technical error occured on user creation!', error);
    });
};

const wrongLogin = 'Wrong login or password!';
const technicalErrorOnFetch = 'Technical error occured while fetching user';
exports.login = (req, res, next) => {
  const requestedEmail = req.body.email;
  User.findOne({ email: requestedEmail })
    .then((user) => {
      if (!user) {
        console.log(wrongLogin, requestedEmail);
        return res.status(401).json({ message: wrongLogin });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            console.log(wrongLogin);
            return res.status(401).json({ message: wrongLogin });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id }, //
              jwtSecretKey, //
              { expiresIn: '24h' } //
            ),
          });
        })
        .catch((error) => {
          res.status(500).json({ error });
          console.log(technicalErrorOnFetch, requestedEmail, error);
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
      console.log(technicalErrorOnFetch, requestedEmail, error);
    });
};
