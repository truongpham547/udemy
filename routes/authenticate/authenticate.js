var Router = require("express").Router();
var jwt = require("jsonwebtoken");
var authenticateController = require("../../controller/authenticate.controller");
var authenticate = require("../../config/authenticate");
var verifyToken = require("../../middleware/verifyToken");
var userController = require("../../controller/user.controller");

Router.post("/login", function(req, res, next) {
  authenticate(req.body, res, next)
    .then(user => {
      if (user == null) {
        return res
          .status(401)
          .send({ message: "invalid username and password" });
      } else {
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.TOKEN_SECRET
        );
        return res
          .status(200)
          .header("auth-token", token)
          .send(user);
      }
    })
    .catch(err => {
      return res.status(500).send({ error: err });
    });
});

Router.post("/register", function(req, res, next) {
  try {
    let userData = req.body;
    let image = req.files;
    authenticateController
      .register(userData, image)
      .then(result => {
        if (result.user == null) {
          return res.status(200).send(result);
        } else {
          const token = jwt.sign(
            { id: result.user._id, role: result.user.role },
            process.env.TOKEN_SECRET
          );
          return res
            .status(200)
            .header("auth-token", token)
            .send(result.user);
        }
      })
      .catch(err => {
        return res.status(500).send(err);
      });
  } catch (error) {
    console.log(error);
  }
});

Router.post("/change-password", verifyToken, function(req, res, next) {
  try {
    let data = req.body;
    userController
      .changePassword(req.user.id, data.oldpassword, data.newpassword)
      .then(result => {
        return res.status(200).send(result);
      });
  } catch (error) {
    return res.status(500).send(err);
  }
});

Router.post("/active-account",(req,res,next)=>{
  authenticateController.activeAccount(req.body).then(user=>{
    return res.status(200).send(user);
  }).catch(err=>{
    return res.status(500).send(err);
  })
});

Router.post("/forgot-password",(req,res,next)=>{
  let data = req.body;
  authenticateController.forgotPassword(data).then(result=>{
    res.status(200).send(result);
  }).catch(err=>{
    res.status(500).send(err);
  })

});


Router.post("/reset-password",(req,res,next)=>{
  let data = req.body;
  authenticateController.resetPassword(data).then(result=>{
    res.status(200).send(result);
  }).catch(err=>{
    console.log(err);
    res.status(500).send(err);
  })

});

module.exports = Router;
