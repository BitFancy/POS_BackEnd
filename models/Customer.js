const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    houseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    streetName: {
      type: String,
      required: true,
      trim: true,
    },
    postCode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('customer', CustomerSchema);
