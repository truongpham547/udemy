const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const { PRIVATE_KEY_PAYMENT } = process.env;
const stripe = require('stripe')(PRIVATE_KEY_PAYMENT); 
const courseController = require("../../controller/course.controller");
const orderController = require("../../controller/order.controller");
const joinController = require("../../controller/join.controller");


Router.get("/get-payment-public-key",async(req,res,next)=>{
    const { PUBLIC_KEY_PAYMENT } = process.env;
    res.status(200).send({key:PUBLIC_KEY_PAYMENT});
});

Router.post("/pay", async (req, res) => {
    try {

        var courseDetail = courseController.getbyId(req.body.idCourse);
        
        var mustPay = courseDetail.price-((courseDetail.price*courseDetail.discount)/100);
        if(req.body.amount!=mustPay){
            res.status(400).send({"message":"Số tiền không hợp lệ"});
        }

        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken
            })
            .then(customer =>{
                stripe.charges.create({
                    amount: req.body.amount,
                    currency: "usd",
                    customer: customer.id
                })
            })
            .then(async() => {
                try{
                    await orderController.createOrder({
                        "idUser":req.body.idUser,
                        "idCourse":req.body.idCourse,
                        "amount":req.body.amount
                    });

                    await joinController.joinCourse({
                        "idUser":req.body.idUser,
                        "idCourse":req.body.idCourse
                    });

                    res.status(200).send({"message":"payment success"});
                }catch(err){
                    res.status(500).send({"message":"Lỗi server"});
                }
            })
            .catch(err => console.log(err));
    } catch (err) {
      res.send(err);
    }
});

module.exports = Router;
