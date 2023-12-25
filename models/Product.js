const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId,
    },
    productName: {
      type: String,
      required: true,
    },
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: 'category',
      },
    ],
    productType: [
      {
        type: Number,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('product', ProductSchema);
