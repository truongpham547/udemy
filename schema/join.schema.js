const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const joinSchema =new Schema({
    idUser:{
        type:Schema.Types.ObjectId,
        required:true
    },
    idCourse:{
        type:Schema.Types.ObjectId,
        required:true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
});

const joins = mongoose.model("joins",joinSchema);
module.exports=joins;