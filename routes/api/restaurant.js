const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

const Role = require('../../config/role');
const auth = require('../../middleware/auth');
const Restaurant = require('../../models/Restaurant');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post(
  '/add',
  auth([Role.Admin]),
  upload.single('restaurantLogo'),
  async (req, res) => {
    body('restaurantName').notEmpty().withMessage('Name is required');
    body('restaurantEmail')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Unvalid Email');
    body('restaurantPhone').notEmpty().withMessage('Phone is required');
    body('restaurantAddress').notEmpty().withMessage('Address is required');
    body('restaurantPostCode').notEmpty().withMessage('PostCode is required');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }
    try {
      const {
        restaurantName,
        restaurantEmail,
        restaurantPhone,
        restaurantAddress,
        restaurantZipCode,
      } = req.body;
      const restaurantLogo = req.file.filename;
      let restaurantByEmail = await Restaurant.findOne({ restaurantEmail }); // check if customer exists
      if (restaurantByEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Restaurant email already exists' }] });
      }
      let restaurantByPhoneNumber = await Restaurant.findOne({
        restaurantPhone,
      }); // check if customer exists
      if (restaurantByPhoneNumber) {
        return res.status(400).json({
          errors: [{ msg: 'Restaurant Phone Number already exists' }],
        });
      }

      const newRestaurant = new Restaurant({
        name: restaurantName,
        email: restaurantEmail,
        phone: restaurantPhone,
        address: restaurantAddress,
        zipcode: restaurantZipCode,
        logo: restaurantLogo,
      });
      await newRestaurant.save();
      res.json(newRestaurant);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    const CurrentRestaurant = await Restaurant.find();
    res.json(CurrentRestaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// router.put(
//   '/update/:id',
//   auth([Role.Admin, Role.User]),
//   check('customerName', 'CustomerName is required').notEmpty(),
//   check('email', 'Email is required').notEmpty(),
//   check('phoneNumber', 'PhoneNumber is required').notEmpty(),
//   check('city', 'City is required').notEmpty(),
//   check('address', 'Adress is required').notEmpty(),
//   check('zipCode', 'ZipCode is required').notEmpty(),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//       const customer = await Customer.findOne({
//         _id: req.params.id,
//       });
//       customer.overwrite(req.body);
//       await customer.save();
//       res.json(customer);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

// router.delete('/delete/:id', auth([Role.Admin]), async (req, res) => {
//   try {
//     const deleteCustomer = await Customer.findOneAndDelete({
//       _id: req.params.id,
//     });
//     if (deleteCustomer) {
//       return res.status(200).json(deleteCustomer);
//     }
//     return res.send({ msg: 'Customer not found or already deleted' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: 'Server error' });
//   }
// });

module.exports = router;
