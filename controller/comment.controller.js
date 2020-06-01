var commentSchema = require("../schema/comment.schema");
const fs=require('fs');
const path = require('path');

async function getParentComment(idCourse,idLesson,skip,limit) {
    try {
        var comments = await commentSchema.find({idCourse:idCourse,idLesson:idLesson,idParent:null}).limit(parseInt(limit)).skip(parseInt(skip));

        var tmpComments=comments;
        
        for(let i=0;i<comments.length;i++){
            try {
                var childComment = await commentSchema.find({idParent:comments[i]._id});
                var tmp = tmpComments[i];
                tmpComments[i]={...tmp._doc,"childComment":childComment};
            } catch (error) {
                throw new Error(error);
            }
            
        }
        return tmpComments;
    } catch (error) {
        throw new Error(error);
    }
}

async function getChildCommentById(idParent){
    try {
        var comments = await commentSchema.find({idParent:idParent}).sort({created_at:-1});
        var tmpComments=comments;
        
        for(let i=0;i<comments.length;i++){
            try {
                var childComment = await commentSchema.find({idParent:comments[i]._id});
                var tmp = tmpComments[i];
                tmpComments[i]={...tmp._doc,"childComment":childComment};
            } catch (error) {
                throw new Error(error);
            }
            
        }
        return tmpComments;
    } catch (error) {
        throw new Error(error);
    }
}

async function addComment(reqData,image){
    try {

        let comment =new commentSchema();
        comment.idCourse = reqData.idCourse;
        if(reqData.idParent=="null"){
            comment.idParent=null;
        }else{
            comment.idParent=reqData.idParent; 
        }
        comment.content = reqData.content;
        comment.idUser=reqData.idUser;
        comment.idLesson = reqData.idLesson;
        comment.image = image;
        let newComment = await comment.save();
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
