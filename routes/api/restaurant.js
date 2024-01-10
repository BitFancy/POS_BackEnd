const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Role = require('../../config/role');
const auth = require('../../middleware/auth');
const Restaurant = require('../../models/Restaurant');

router.post(
  '/add',
  auth([Role.Admin]),
  check('restaurantName', 'RestaurantName is required').notEmpty(),
  check('restaurantEmail', 'Email is required').isEmail(),
  check('restaurantPhone', 'PhoneNumber is required').notEmpty(),
  check('restaurantAddress', 'Adress is required').notEmpty(),
  check('restaurantZipCode', 'ZipCode is required').notEmpty(),
  check('restaurantLogo', 'Logo is required').notEmpty(),
  async (req, res) => {
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
        restaurantLogo,
      } = req.body;
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
        return res
          .status(400)
          .json({
            errors: [{ msg: 'Restaurant Phone Number already exists' }],
          });
      }

      const newRestaurant = new Customer({
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

router.put(
  '/update/:id',
  auth([Role.Admin, Role.User]),
  check('customerName', 'CustomerName is required').notEmpty(),
  check('email', 'Email is required').notEmpty(),
  check('phoneNumber', 'PhoneNumber is required').notEmpty(),
  check('city', 'City is required').notEmpty(),
  check('address', 'Adress is required').notEmpty(),
  check('zipCode', 'ZipCode is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const customer = await Customer.findOne({
        _id: req.params.id,
      });
      customer.overwrite(req.body);
      await customer.save();
      res.json(customer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/delete/:id', auth([Role.Admin]), async (req, res) => {
  try {
    const deleteCustomer = await Customer.findOneAndDelete({
      _id: req.params.id,
    });
    if (deleteCustomer) {
      return res.status(200).json(deleteCustomer);
    }
    return res.send({ msg: 'Customer not found or already deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
