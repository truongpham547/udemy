const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema =new Schema({
    idUser:{
        type:Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    idCourse:{
        type:Schema.Types.ObjectId,
        ref: 'course',
        required:true
    },
    idLesson:{
        type:Schema.Types.ObjectId,
        ref:'course',
        required:true
    },
    content:{
        type:String,
        required:true
    },
    idParent:{
        type:Schema.Types.ObjectId,
        default:null,
        sparse:true
    },
    image:{
        type:String,
        default:"",
        required:true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
});

const comments = mongoose.model("comments",commentSchema);
module.exports=comments;