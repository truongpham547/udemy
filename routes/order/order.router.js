const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const orderController = require("../../controller/order.controller");


Router.get("/get-list-course-ordered-by-id-user/:idUser",async(req,res,next)=>{
    try{
        let orders = orderController.getListCourseOrdered(req.params.idUser);
        res.status(200).send(orders);
    }catch(error){
        res.status(500).send({"message":"Lỗi server"});
    }
});


module.exports = Router;
