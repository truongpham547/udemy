const Router = require("express").Router();
const categoryController = require("../../controller/category.controller");
var verifyToken = require("../../middleware/verifyToken");
var multer  = require('multer');
const { check, validationResult,body } = require('express-validator');
const fs=require('fs');
const path= require('path');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload/category')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix+'-'+file.originalname )
    }
  })
  
var upload = multer({ storage: storage });
  


let validateCategory=[
    body('image').custom((value, { req }) => {
      if(req.file == undefined){
        throw new Error('Vui lòng chọn file hình ảnh');
      }else{
        var mimetype=req.file.mimetype;
        var type=mimetype.split("/")[1];
        if(type!="jpeg" && type!="png" && type!="jpg"){
          fs.unlink(path.join(__dirname, '../../public/upload/category/')+req.file.filename,(err)=>{
            console.log(err);
          });
          throw new Error('Các định dạng file yêu cầu là JPEG, PNG, JPG');
        }
        return true;
      }
    }),
    check('name').exists().withMessage("Vui lòng nhập tên danh mục").isLength({min:3}).withMessage("Tên phải dài hơn 3 kí tự"),
];


Router.post("/add-category",[verifyToken,upload.single('image'),validateCategory], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
    }
    categoryController.addCategory(req.body,req.file.filename).then(result=>{
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

Router.put("/update-category/:id", verifyToken,function(req, res, next) {
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

Router.delete("/delete-category/:id",verifyToken,function(req, res, next) {
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