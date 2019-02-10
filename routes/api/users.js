const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const User = require('../../models/User');

// @route  POST api/users/register
// @desc   Register a user
// @access Public
router.post('/register', (req,res) => {

  const { errors, isValid } = validateRegisterInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }

  console.log(req.body)

  User.findOne({ email: req.body.email })
    .then(user => {
      if(user) {
        errors.email = 'Email already exists';
        return res.status(404).json(errors)
      }

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        });
      });


    });
});


// @route  GET api/users/login
// @desc   Login User return token
// @access Public
router.post('/login', (req,res) => {

  const { errors, isValid } = validateLoginInput(req.body)

  if(!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email})
    .then(user => {
      if(!user) {
        errors.email = 'User not found'
        return res.status(404).json(errors)
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch) {
            const payload = { id: user.id, name: user.name, avatar: user.avatar }

            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 36000 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
          }
          else {
            errors.password = 'password incorrect';
            return res.status(400).json(errors)
          }
        })
    });
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req,res) => {
  res.json({id: req.user.id, name: req.user.name, email: req.user.email})
});

module.exports = router;
