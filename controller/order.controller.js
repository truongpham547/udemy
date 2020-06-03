var orderSchema = require("../schema/order.schema");
const fs=require('fs');
const path = require('path');

async function createOrder(reqData) {
    try {
        var order = new orderSchema();
        order.idUser= reqData.idUser;
        order.idCourse = reqData.idCourse;
        order.payed=1;
        order.amount=reqData.amount;
        order.save();
    } catch (error) {
        throw new Error(error);
    }
}

async function getListCourseOrdered(idUser){
    try{
        let orders =await orderSchema.find({idUser:idUser})
            .populate("idUser",["email","name","image"],"users")
            .populate("idCourse",["vote","price","discount","description","goal","image","name"],"courses");
        return orders;
    }catch(err){
        throw new Error(err);
    }
}

async function getOrderByIdUserAndIdCourse(idUser,idCourse){
    try{
        let order = await orderSchema.findOne({idUser:idUser,idCourse:idCourse});
        return order;
    }catch(err){
        throw new Error(err);
    }
}

module.exports = {
    createOrder:createOrder,
    getListCourseOrdered:getListCourseOrdered,
    getOrderByIdUserAndIdCourse:getOrderByIdUserAndIdCourse
}
