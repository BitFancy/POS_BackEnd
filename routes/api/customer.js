const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Role = require('../../config/role');
const auth = require('../../middleware/auth');
const Customer = require('../../models/Customer');

router.post(
  '/add',
  auth([Role.Admin, Role.User]),
  check('customerName', 'CustomerName is required').notEmpty(),
  check('email', 'Email is required').isEmail(),
  check('phoneNumber', 'PhoneNumber is required').notEmpty(),
  check('city', 'City is required').notEmpty(),
  check('address', 'Adress is required').notEmpty(),
  check('zipCode', 'ZipCode is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }
    try {
      const { customerName, email, phoneNumber, city, address, zipCode } =
        req.body;
      let customerByEmail = await Customer.findOne({ email }); // check if customer exists
      if (customerByEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Customer already exists' }] });
      }
      let customerByPhoneNumber = await Customer.findOne({ phoneNumber }); // check if customer exists
      if (customerByPhoneNumber) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Phone Number already exists' }] });
      }

      const newCustomer = new Customer({
        customerName: customerName,
        email: email,
        phoneNumber: phoneNumber,
        city: city,
        address: address,
        zipCode: zipCode,
      });
      await newCustomer.save();
      res.json(newCustomer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    const allCustomers = await Customer.find();
    res.json(allCustomers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    res.json(customer);
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
