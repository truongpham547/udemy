const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const userController = require("../../controller/user.controller");

Router.use('/',require('./profile.router.js'));

module.exports = Router;
