const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'customer',
    },
    dishes: [
      {
        id: {
          type: String,
          required: true,
        },
        dishName: {
          type: String,
          required: true,
        },
        productList: [
          {
            type: Schema.Types.ObjectId,
            ref: 'product',
          },
        ],
        dishPrice: {
          type: Number,
          required: true,
        },
        counter: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymethod: {
      type: String,
      ref: 'paymethod',
    },
    status: {
      type: String,
      default: 'New',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('order', OrderSchema);
