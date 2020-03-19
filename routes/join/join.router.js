const Router = require("express").Router();
// const verifyToken = require("../../middleware/verifyToken");
const joinController = require("../../controller/join.controller");

Router.post("/create-join", function(req, res, next) {
        let userData = req.body;
        joinController.joinCourse(userData).then(result => {
            if(result.status){
                return res.status(200).send(result.newJoin);
            }else{
                return res.status(500).send({message:result.message});
            }
        }).catch (error=>{
            console.log(error)
            return res.status(500).send({message:"Lỗi Server"});
        });
    
});

Router.get("/get-courses-joined-by-user/:id",function(req, res, next) {
        let userData = req.body;
        let id = req.params.id;
        joinController.getCoursesJoinedByIdUser(id).then(result => {
            return res.status(200).send(result);
        }).catch (error=>{
            console.log(error)
            return res.status(500).send({message:"Lỗi Server"});
        });
});

module.exports=Router;