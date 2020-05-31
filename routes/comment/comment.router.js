const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const commentController = require("../../controller/comment.controller");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/comment_image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });


Router.get("/get-parent-comment-by-lesson/:idCourse/:idLesson",async(req,res,next)=>{
    try{
        let comments =await commentController.getParentComment(req.params.idCourse,req.params.idLesson);
        return res.status(200).send(comments);
    }catch(error){
        console.log(error);
        res.status(200).send({"message":"Lỗi server"});
    }
    
});

Router.get('/get-comments',async(req,res,next)=>{
    commentController.getComments()
    .then((comments) => {
      return res.status(200).send(comments);
    })
    .catch((err) => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get('/get-child-comment-by-id-parent/:idParent',async (req,res,next)=>{
    try{
        let comments = await commentController.getChildCommentById(req.params.idParent);
        return res.status(200).send(comments);
    }catch(error){
        return res.status(500).send({"message":"Lỗi server"});
    }
});

Router.post("/add-comment",upload.single("image"),async(req,res,next)=>{
    try{
        let newComment =await commentController.addComment(req.body,req.file.filename);
        return res.status(200).send(newComment);
    }catch(error){
        console.log(error);
        res.status(200).send({"message":"Lỗi server"});
    }
    
});

module.exports = Router;
