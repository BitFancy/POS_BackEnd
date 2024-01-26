const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostCodesSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    latitude: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    longitude: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('postcodes', PostCodesSchema);
