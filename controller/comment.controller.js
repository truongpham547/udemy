var commentSchema = require("../schema/comment.schema");
const fs=require('fs');
const path = require('path');

async function getParentComment(idCourse,idLesson) {
    var commentWithChid=[];
    try {
        var comments = await commentSchema.find({idCourse:idCourse,idLesson:idLesson,idParent:null});
        
        for(let i=0;i<comments.length;i++){
            var childComment={};
            try {
                let data={}
                childComment = await commentSchema.find({idParent:comments[i]._id});
                
                data["parentComment"]=comments[i];
                data["childComment"]=childComment;
                commentWithChid.push(data);
              
            } catch (error) {
                throw new Error(error);
            }
            
        }
        return commentWithChid;
    } catch (error) {
        throw new Error(error);
    }
}

async function getChildCommentById(idParent){
    var commentWithChid=[];
    try {
        var comments = await commentSchema.find({idParent:idParent}).sort({created_at:-1});
        
        for(let i=0;i<comments.length;i++){
            var childComment={};
            try {
                let data={}
                childComment = await commentSchema.find({idParent:comments[i]._id});
                
                data["parentComment"]=comments[i];
                data["childComment"]=childComment;
                commentWithChid.push(data);
              
            } catch (error) {
                throw new Error(error);
            }
            
        }
        return commentWithChid;
    } catch (error) {
        throw new Error(error);
    }
}

async function addComment(reqData,image){
    try {
        let comment =new commentSchema();
        comment.idCourse = reqData.idCourse;
        comment.idParent=reqData.idParent;
        comment.content = reqData.content;
        comment.idUser=reqData.idUser;
        comment.idLesson = reqData.idLesson;
        comment.image = image;
        newComment = await comment.save();
        return newComment;
    } catch (error) {
        throw new Error(error);
    }
}



module.exports = {
    getParentComment:getParentComment,
    addComment:addComment,
    getChildCommentById:getChildCommentById
}
