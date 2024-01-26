const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Role = require('../../config/role');
const auth = require('../../middleware/auth');
const PostCodes = require('../../models/Postcodes');

router.get('/all', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    // console.log(req);
    // res.json('allPostCoddddddddddddddddes');
    const allPostCodes = await PostCodes.find();
    // console.log(allPostCodes);
    res.json(allPostCodes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', auth([Role.Admin, Role.User]), async (req, res) => {
  try {
    console.log(req.params.id);
    // const postcode = await PostCodes.findOne({
    //   _id: req.params.id,
    // });
    const postcode = await PostCodes.findOne({
      postcode: req.params.id,
    });
    console.log(postcode, 'postcode');
    if (postcode) {
      res.json(postcode);
    } else {
      res.status(404).json({ msg: 'Postcode not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
