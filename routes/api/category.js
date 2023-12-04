const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Role = require('../../config/role');
const auth = require('../../middleware/auth');
const Category = require('../../models/Category');

router.post(
  '/add',
  auth([Role.Admin]),
  check('categoryName', 'CategoryName is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { categoryName } = req.body;
      let category = await Category.findOne({ categoryName });
      if (category) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Category already exists' }] });
      }
      const newCategory = new Category({
        categoryName: categoryName,
      });
      await newCategory.save();
      res.json(newCategory);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/all', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.json(allCategories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
    });
    res.json(category.categoryName);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put(
  '/update/:id',
  auth([Role.Admin]),
  check('categoryName', 'CategoryName is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const category = await Category.findOne({
        _id: req.params.id,
      });
      category.overwrite(req.body);
      await category.save();
      res.json(category);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/delete/:id', auth([Role.Admin]), async (req, res) => {
  try {
    const deleteCategory = await Category.findOneAndDelete({
      _id: req.params.id,
    });
    return res.status(200).json(deleteCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
