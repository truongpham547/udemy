const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const UserController = require("../../controller/user.controller");

Router.get("/get-all", verifyToken, function (req, res, next) {
  UserController.getUsers()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.delete("/delete/:id", verifyToken, function (req, res, next) {
  UserController.deleteuser(req.params.id)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/grantadmin/:id", verifyToken, function (req, res, next) {
  UserController.grantadmin(req.params.id)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

module.exports = Router;
