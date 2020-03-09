const Router = require("express").Router();
const categoryController = require("../../controller/category.controller");

Router.post("/add-category", function(req, res, next) {
    categoryController.addCategory(req.body).then(newCategory=>{
        return res.status(200).send(newCategory);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send(err);
    })
});

Router.put("/update-category/:id", function(req, res, next) {
    categoryController.updateCategory(req.params.id,req.body).then(newCategory=>{
        return res.status(200).send(newCategory);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send(err);
    })
});

Router.delete("/delete-category/:id", function(req, res, next) {
    categoryController.deleteCategory(req.params.id).then(deletedCategory=>{
        return res.status(200).send(deletedCategory);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send(err);
    })
});

Router.get("/get-category-by-id/:id", function(req, res, next) {
    categoryController.getCategory(req.params.id).then(category=>{
        return res.status(200).send(category);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send(err);
    })
});

Router.get("/get-all-category", function(req, res, next) {
    categoryController.getCategories().then(categories=>{
        return res.status(200).send(categories);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send(err);
    })
});


module.exports= Router;