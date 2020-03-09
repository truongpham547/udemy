const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = Schema({
    name:{
        type:String,
        required:true
    }
});

const categories = mongoose.model("categories",categorySchema);
module.exports = categories;