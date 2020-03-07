const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  idUser: {
    type: Schema.Types.ObjectId,
    required: true
  },
  background: {
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
    type: String,
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

  //trung bình cộng của lược vote (bằng sao)
  vote:{
    type:Number,
    default:0
  },

  //thời gian dự kiến hoàn thành khóa học
  duration:{
    type:String
  },

  created_at: {
    type: Date,
    default: Date.now()
  },

  updated_at: Date
});

const courses = mongoose.model("courses", courseSchema);
module.exports = courses;
