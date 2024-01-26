const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../../models/User');
const auth = require('../../middleware/auth');
const Role = require('../../config/role');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.get('/all', auth([Role.User, Role.Admin]), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message, '23');
    console.log(err.message, 'erroe');
    res.status(500).send('Server Error');
  }
});

router.get('/me', auth([Role.User, Role.Admin]), async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    res.status(405).json({ msg: 'No user' });
  } else {
    res.json(user);
  }
});

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/register',
  [
    check('userName', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('role', 'Role is required').notEmpty(),
  ],
  auth([Role.Admin]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        data: {
          error: errors.array(),
        },
      });
    }

    const { userName, email, password, role } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        }),
        { forceHttps: true }
      );

      user = new User({
        userName: userName,
        email: email,
        avatar,
        password: password,
        role: role,
      });

      console.log(role);
      // console.log(user)

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user
        .save()
        .then(() => {
          res.status(201).json({
            msg: 'User created successfully',
            user: user,
          });
        })
        .catch((err) => console.log(err));

      // const payload = {
      //   user: {
      //     id: user.id,
      //   },
      // };

      // jwt.sign(
      //   payload,
      //   config.get('jwtSecret'),
      //   { expiresIn: '1d' },
      //   (err, token) => {
      //     if (err) throw err;
      //     res.json({ token });
      //   }
      // );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/users/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/login',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Password' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '1d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
