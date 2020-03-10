const Router = require("express").Router();
const categoryController = require("../../controller/category.controller");

Router.post("/add-category", function(req, res, next) {
    categoryController.addCategory(req.body).then(result=>{
        if(result.status){
            return res.status(200).send(result.category);
        }else{
            return res.status(500).send({message:result.message});
        }
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({message:"Lỗi server"});
    })
});

Router.put("/update-category/:id", function(req, res, next) {
    categoryController.updateCategory(req.params.id,req.body).then(result=>{
        if(result.status){
            return res.status(200).send(result.category);
        }else{
            return res.status(500).send({message:result.message});
        }
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({message:"Lỗi server"});
    })
});

Router.delete("/delete-category/:id", function(req, res, next) {
    categoryController.deleteCategory(req.params.id).then(deletedCategory=>{
        return res.status(200).send(deletedCategory);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({message:"Lỗi server"});
    })
});

Router.get("/get-category-by-id/:id", function(req, res, next) {
    categoryController.getCategory(req.params.id).then(category=>{
        return res.status(200).send(category);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({message:"Lỗi server"});
    })
});

Router.get("/get-all-category", function(req, res, next) {
    categoryController.getCategories().then(categories=>{
        return res.status(200).send(categories);
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({message:"Lỗi server"});
    })
});


module.exports= Router;