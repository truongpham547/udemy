const Router=require('express').Router();

Router.use('/category',require('./category.router.js'));

module.exports = Router;