const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Roles = require('../config/role');

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      // type: Number,
      type: String,
      enum: Object.keys(Roles),
      // default: 2,
      default: Roles.User,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
