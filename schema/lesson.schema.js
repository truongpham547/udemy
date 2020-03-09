const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = Schema({
    videos:[],
    docFiles:[],
    //exercise is pending
});

const lessons = mongoose.model("lessons",lessonSchema);
module.exports = lessons;