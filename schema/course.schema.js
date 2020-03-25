const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = require("./user.schema");
const category = require("./category.schema");

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  idUser: {
    type: Schema.Types.ObjectId,
    required: true
  },
  //hinh nen
  image: {
    type: String
  },
  goal: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true
  },
  price: {
    type: Number,
    required: true
  },

  discount: {
    type: Number,
    default: 0
  },

  vote: {
    totalPoint: {
      type: Number,
      default: 0
    },
    totalVote: {
      type: Number,
      default: 0
    },
    EVGVote: {
      type: Number,
      default: 0
    }
  },

  created_at: {
    type: Date,
    default: Date.now()
  },

  updated_at: Date
});

const courses = mongoose.model("courses", courseSchema);
module.exports = courses;
