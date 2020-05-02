const lessonSchema = require('../schema/lesson.schema');
const fs=require('fs');
const path= require('path');

function createLesson(docs,video,data){
    return new Promise((resolve,reject)=>{
        let lesson = new lessonSchema();
        lesson.doc=docs;
        lesson.video=video;
        lesson.idCourse=data.idCourse;
        lesson.title = data.title;
        lesson.order = data.order;
        lesson.save().then(newLesson=>{
            resolve(newLesson);
        }).catch(err=>{
            reject(err);
        })
    });
}

function getLessonByCourseId(idCourse){
    return new Promise((resolve,reject)=>{
        lessonSchema.find({idCourse:idCourse}).sort({order:1}).then(lesson=>{
            return resolve(lesson);
        }).catch(err=>{
            return reject(err);
        })
    });
}

function deleteLesson(idLesson){
    return new Promise((resolve,reject)=>{
        lessonSchema.deleteOne({_id:idLesson}).then(deleted=>{
            return resolve(deleted);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function updateLesson(idLesson,data){
    return new Promise((resolve,reject)=>{
        let updateOption={                
            title:data.title,
            order:data.order,
            idCourse:data.idCourse
        };

        lessonSchema.findOneAndUpdate({_id:idLesson},updateOption,{new:true}).then(newLesson=>{
            return resolve(newLesson);
        }).catch(err=>{
            return reject(err);
        });
    });
}

function deleteFileOfLesson(fileName){
    return new Promise((resolve,reject)=>{
        fs.unlink(path.join(__dirname, '../public/upload/lesson/')+fileName,(err)=>{
            if(err){
                reject(err);
            }else{
                resolve({"message":"Deleted"});
            }
        });
    });
}

function deleteMultipleChoice(idLesson,idMultipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.update(
            {_id: idLesson},
            {$pull: {multipleChoices: {_id:idMultipleChoice}}},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
    })
}

function addAnMultipleChoice(idLesson,multipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.update(
            {_id: idLesson},
            {$push: {multipleChoices: multipleChoice}},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
    })
}

function addVideo(idLesson,video){
    return new Promise((resolve,reject)=>{
        lessonSchema.update({_id: idLesson},{
            video:video
        }).then(newLesson=>{
            resolve(newLesson);
        }).catch(err=>{
            reject(err);
        });
    })
}

function addDoc(idLesson,doc){
    return new Promise((resolve,reject)=>{
        lessonSchema.update(
            {_id: idLesson},
            {$push: {doc: doc}},
            function(err,result){
                if(err){
                    console.log(err);
                    return reject(err);
                }
                console.log(result)
                return resolve(result);
            }
        );
    })
}

function addListMultipleChoice(idLesson,multipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.update(
            {_id: idLesson},
            {multipleChoices:multipleChoice}
        ).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        });
    })
}

function getLessonById(idLesson){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOne({_id: idLesson}).then(result=>{
            resolve(result);
        }).catch(err=>{
            reject(err);
        });
    })
}


module.exports={
    createLesson:createLesson,
    getLessonByCourseId:getLessonByCourseId,
    deleteLesson:deleteLesson,
    updateLesson:updateLesson,
    deleteFileOfLesson:deleteFileOfLesson,
    deleteMultipleChoice:deleteMultipleChoice,
    addAnMultipleChoice:addAnMultipleChoice,
    addVideo:addVideo,
    addDoc:addDoc,
    addListMultipleChoice:addListMultipleChoice,
    getLessonById:getLessonById
}