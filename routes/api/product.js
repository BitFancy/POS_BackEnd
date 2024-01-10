const express = require('express');
const router = express.Router();

const Role = require('../../config/role');
const auth = require('../../middleware/auth');
const Product = require('../../models/Product');
const Category = require('../../models/Category');

router.post('/add', auth([Role.Admin]), async (req, res) => {
  const { productName, category, productType, price } = req.body;
  try {
    Product.findOne({ productName: productName }).then(async (product, err) => {
      if (product === null) {
        console.log("Product doesn't exist yet, create a new one");
        product = new Product({
          productName: productName,
          category: [category],
          productType: productType,
          price: price,
        });
        await product.save();
        return res.json(product);
      } else if (product.category.indexOf(category) === -1) {
        console.log('Product exists, add the new category');
        product.category.push(category);
        await product.save();
        return res.json(product);
      } else {
        console.log('Product exists, do nothing');
        return res.send({ msg: 'Product exists, do nothing' });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

router.get('/', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    // const products = await Product.find();
    const products = await Product.find().populate({ path: 'category' });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get(
  '/product-detail/:id',
  auth([Role.Admin, Role.User]),
  async (req, res) => {
    try {
      const productDetail = await Product.findOne({
        _id: req.params.id,
      }).populate({ path: 'category' });
      res.json(productDetail);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/:productId', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.productId });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete(
  '/delete/:id',
  auth([Role.Admin, Role.User]),
  async (req, res) => {
    // const { productName, category } = req.body;
    // try {
    //   Product.findOne({ productName: productName }).then(async (product, err) => {
    //     if (product === null) {
    //       console.log("Product doesn't exist");
    //       res.send("Product doesn't exist");
    //     } else if (product.category.indexOf(category) === -1) {
    //       console.log('Nothing to delete');
    //       res.send({ mgs: 'Nothing to delete' });
    //     } else if (product.category.length === 1) {
    //       console.log('Delete the product');
    //       await Product.findOneAndDelete({ productName: productName });
    //       res.send({ msg: 'Delete the product' });
    //     } else {
    //       console.log('Delete the category');
    //       product.category.pull(category);
    //       await product.save();
    //       res.send({ msg: 'Delete the category' });
    //     }
    //   });
    // } catch (err) {
    //   console.error(err.message);
    //   res.status(500).send('Server Error');
    // }
    try {
      const deleteProduct = await Product.findOneAndDelete({
        _id: req.params.id,
      });
      return res.status(200).json(deleteProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;
