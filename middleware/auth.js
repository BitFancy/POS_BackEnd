const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

const auth = (roles) => async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    jwt.verify(token, config.get('jwtSecret'), async (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.user;
        const user = await User.findById(decoded.user.id);

        if (user) {
          // console.log(user.role);
          // console.log(roles.includes(user.role));
          // if (roles.findIndex((role) => role === user.role) !== -1) next();
          if (roles.includes(user.role)) next();
          else res.status(404).json({ msg: 'Auth Error' });
        } else {
          res.status(404).json({ msg: 'User not found' });
        }
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = auth;
