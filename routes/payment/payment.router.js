const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const { PRIVATE_KEY_PAYMENT } = process.env;
const stripe = require('stripe')(PRIVATE_KEY_PAYMENT); 


Router.get("/get-payment-public-key",async(req,res,next)=>{
    const { PUBLIC_KEY_PAYMENT } = process.env;
    res.status(200).send({key:PUBLIC_KEY_PAYMENT});
});

Router.post("/pay", (req, res) => {
    try {
        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken
            })
            .then(customer =>
                stripe.charges.create({
                    amount: req.body.amount,
                    currency: "usd",
                    customer: customer.id
                })
            )
            .then(() => {
                res.status(200).send({"message":"payment success"});
            })
            .catch(err => console.log(err));
    } catch (err) {
      res.send(err);
    }
});

module.exports = Router;
