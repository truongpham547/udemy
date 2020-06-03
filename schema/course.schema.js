const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = require("./user.schema");
const category = require("./category.schema");

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  idUser: {
    type: Schema.Types.ObjectId,
    ref: user,
    required: true,
  },
  //hinh nen
  image: {
    type: String,
  },
  goal: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: category,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  discount: {
    type: Number,
    default: 0,
  },

  vote: {
    totalVote: {
      type: Number,
      default: 0,
    },
    EVGVote: {
      type: Number,
      default: 0,
    },
  },
  ranking: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  is_checked: {
    type: Number,
    default: 0,
  },
  updated_at: Date,
});
courseSchema.index({name: 'text', description: 'text',goal:'text'});

const courses = mongoose.model("courses", courseSchema);
module.exports = courses;
