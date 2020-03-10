const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  role: {
    type: String
  },
  image: {
    type: String
  },
  gender: {
    type: String,
    required: true
  },

  active: {
    type: Number,
    default: 0
  },

  activeToken: {
    type: String
  },

  resetPasswordRoken: {
    type: String
  },

  description: String,

  created_at: {
    type: Date,
    default: Date.now()
  },

  updated_at: Date
});

const users = mongoose.model("users", userSchema);
module.exports = users;
