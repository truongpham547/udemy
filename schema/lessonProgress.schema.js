const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonProgressSchema =new Schema({
    idLesson: {
        type:Schema.Types.ObjectId,
        required:true
    }, 
    isCompleted:{
        type:Number,
        default:0
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    idJoin:{
        type:Schema.Types.ObjectId,
    }
});

const lessonProgress = mongoose.model("lesson-progress",lessonProgressSchema);
module.exports=lessonProgress;