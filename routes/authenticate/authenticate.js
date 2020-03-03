var Router=require('express').Router();
var jwt = require('jsonwebtoken');
var authenticateController = require('../../controller/authenticate.controller');
var authenticate = require('../../config/authenticate');

Router.post('/login',function(req, res, next) {
    authenticate(req.body,res,next).then(user=>{
        if(user==null){
            return res.status(401).send({message:"invalid username and password"});
        }else{
            const token=jwt.sign({id:user._id,role:user.role},process.env.TOKEN_SECRET) 
            return res.status(200).header('auth-token',token).send(user);
        }
    }).catch(err=>{
        return res.status(500).send({"error":err});
    })

});

Router.post('/register',function(req,res,next){
    try{
        let userData= req.body;
        let image=req.files;
        authenticateController.register(userData,image).then(newUser=>{
            if(newUser==null){
                return res.status(500).send({message:""});
            }else{
                const token=jwt.sign({id:newUser._id,role:newUser.role},process.env.TOKEN_SECRET) 
                return res.status(200).header('auth-token',token).send(newUser);
            }
        }).catch(err=>{
            return res.status(500).send(err);
        });
    }catch(error){
        console.log(error);
    }

});

module.exports = Router;