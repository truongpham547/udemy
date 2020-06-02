const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema =new Schema({
    idUser:{
        type:Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    idCourse:{
        type:Schema.Types.ObjectId,
        ref:'course',
        required:true
    },
    payed:{
        type:Number,
        required:true,
        default:0
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
});

const joins = mongoose.model("orders",orderSchema);
module.exports=joins;