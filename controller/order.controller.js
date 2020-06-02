var orderSchema = require("../schema/order.schema");
const fs=require('fs');
const path = require('path');

async function createOrder(reqData) {
    try {
        var order = new orderSchema();
        order.idUser= reqData.idUser;
        order.idCourse = reqData.idCourse;
        order.payed=1;
        order.save();
    } catch (error) {
        throw new Error(error);
    }
}



module.exports = {
    createOrder:createOrder
}
