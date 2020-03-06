const Router = require("express").Router();


Router.use('/',require('./profile.router.js'));

module.exports = Router;
