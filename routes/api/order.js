const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Role = require('../../config/role');
const auth = require('../../middleware/auth');
const Order = require('../../models/Order');

router.post(
  '/add',
  auth([Role.Admin, Role.User]),
  check('dish', 'Dish is required').notEmpty(),
  check('customer', 'Customer is required').notEmpty(),
  check('totalPrice', 'Total Price is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { dish, customer, status, totalPrice } = req.body;
      const newOrder = new Order({
        dish: dish, // array of products
        customer: customer, // object
        status: status, // string
        totalPrice: totalPrice, // number
      });
      await newOrder.save();
      res.json(newOrder);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.json(allOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put(
  '/update/:id',
  auth([Role.Admin, Role.User]),
  check('products', 'Products is required').notEmpty(),
  check('customer', 'Customer is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const order = await Order.findOne({
        _id: req.params.id,
      });
      order.overwrite(req.body);
      await order.save();
      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/delete/:id', auth([Role.Admin]), async (req, res) => {
  try {
    const deleteOrder = await Order.findOneAndDelete({
      _id: req.params.id,
    });
    if (deleteOrder) {
      return res.status(200).json(deleteOrder);
    }
    return res.send({mgs: "Order not found or already deleted"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
