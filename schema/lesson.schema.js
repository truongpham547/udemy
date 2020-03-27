const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = Schema({
    title:{
        type:String,
        required:true
    },
    idCourse:{
        type:Schema.Types.ObjectId,
        required:true
    },
    order:{
        type:Number,
        required:true
    },
    video:{
        type:String
    },
    doc:[],
    multipleChoices:[
        {
            A:{
                type:String, 
                required:true
            },
            B:{
                type:String,
                required:true
            },
            C:{
                type:String,
                required:true
            },
            D:{
                type:String,
                required:true
            },
            answer:{
                type:String,
                required:true
            }
        }
    ]
});

const lessons = mongoose.model("lessons",lessonSchema);
module.exports = lessons;