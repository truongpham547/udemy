const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const userController = require("../../controller/user.controller");

Router.put("/change-avatar", verifyToken, function(req, res, next) {
  try {
    if (!req.files) return res.status(200).send({ status: "error" });
    let image = req.files;
    userController.changeAvatar(req.user.id, image).then(result => {
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

Router.put("/change-profile", verifyToken, function(req, res, next) {
  try {
    let data = req.body;
    console.log(data);
    userController.changeProfile(req.user.id, data).then(result => {
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = Router;
