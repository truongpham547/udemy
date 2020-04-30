const Router = require("express").Router();

Router.use("/", require("./profile.router.js"));
Router.use("/user/", require("./user.router.js"));

module.exports = Router;
