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

function deleteFileOfLesson(idLesson,fileName){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$pull: {doc: fileName}},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                fs.unlink(path.join(__dirname, '../public/upload/lesson/')+fileName,(err)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve({"message":"Deleted"});
                    }
                });
            }
        );
    });
}

function deleteMultipleChoice(idLesson,idMultipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOne({_id:idLesson}).then(oldDoc=>{
            for(let i=0;i<oldDoc.multipleChoices.length;i++){
                if(oldDoc.multipleChoices[i]._id==idMultipleChoice){
                    if(oldDoc.multipleChoices[i].image==undefined){
                        lessonSchema.findOneAndUpdate(
                            {_id: idLesson},
                            {$pull: {multipleChoices: {_id:idMultipleChoice}}},
                            {new: true},
                            function(err,result){
                                if(err){
                                    return reject(err);
                                }
                                return resolve(result);
                            }
                        );
                    }else{
                        fs.unlink(path.join(__dirname, '../public/upload/lesson/')+oldDoc.multipleChoices[i].image,(err)=>{
                            if(err){
                                reject(err);
                            }else{
                                lessonSchema.findOneAndUpdate(
                                    {_id: idLesson},
                                    {$pull: {multipleChoices: {_id:idMultipleChoice}}},
                                    {new: true},
                                    function(err,result){
                                        if(err){
                                            return reject(err);
                                        }
                                        return resolve(result);
                                    }
                                );
                            }
                        });
                        break;
                    }

                }
                
            }
        }).catch(err=>{
            reject(err);
        })

    })
}

function addAnMultipleChoice(idLesson,multipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$push: {multipleChoices: multipleChoice}},
            {new: true},
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
        lessonSchema.findOne({_id:idLesson}).then(lesson=>{
            fs.unlink(path.join(__dirname, '../public/upload/lesson/')+lesson.video,(err)=>{
                if(err){
                    reject(err);
                }else{
                    lessonSchema.findOneAndUpdate({_id: idLesson},{
                        video:video
                    },{new: true}).then(newLesson=>{
                        resolve(newLesson);
                    }).catch(err=>{
                        reject(err);
                    });
                }
            });
        }).catch(err=>{
            reject(err);
        });
    })
}

function addDoc(idLesson,doc){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$push: {doc: doc}},
            {new: true},
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
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {multipleChoices: multipleChoice},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
    })
}

function addMoreListMultipleChoice(idLesson,multipleChoice){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$push: {multipleChoices: multipleChoice}},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
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

function deleteImageMultipleChoice(image){
    return new Promise((resolve,reject)=>{
        fs.unlink(path.join(__dirname, '../public/upload/lesson/')+image,(err)=>{
            if(err){
                reject(err);
            }else{
                resolve({"message":"Deleted"});
            }
        });
    });
}


function addListPopupQuestion(idLesson,popupQuestion){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOneAndUpdate(
            {_id: idLesson},
            {$push:{popupQuestion: popupQuestion}},
            {new: true},
            function(err,result){
                if(err){
                    return reject(err);
                }
                return resolve(result);
            }
        );
    })
}


function deletePopupQuestion(idLesson,idPopupQuestion){
    return new Promise((resolve,reject)=>{
        lessonSchema.findOne({_id:idLesson}).then(oldDoc=>{
            for(let i=0;i<oldDoc.popupQuestion.length;i++){
                if(oldDoc.popupQuestion[i]._id==idPopupQuestion){
                    if(oldDoc.popupQuestion[i].image==undefined){
                        lessonSchema.findOneAndUpdate(
                            {_id: idLesson},
                            {$pull: {popupQuestion: {_id:idPopupQuestion}}},
                            {new: true},
                            function(err,result){
                                if(err){
                                    return reject(err);
                                }
                                return resolve(result);
                            }
                        );
                    }else{
                        fs.unlink(path.join(__dirname, '../public/upload/lesson/')+oldDoc.popupQuestion[i].image,(err)=>{
                            if(err){
                                reject(err);
                            }else{
                                lessonSchema.findOneAndUpdate(
                                    {_id: idLesson},
                                    {$pull: {popupQuestion: {_id:idPopupQuestion}}},
                                    {new: true},
                                    function(err,result){
                                        if(err){
                                            return reject(err);
                                        }
                                        return resolve(result);
                                    }
                                );
                            }
                        });
                        break;
                    }
                }
                
            }
        }).catch(err=>{
            reject(err);
        })

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
    getLessonById:getLessonById,
    deleteImageMultipleChoice:deleteImageMultipleChoice,
    addListPopupQuestion:addListPopupQuestion,
    deletePopupQuestion:deletePopupQuestion,
    addMoreListMultipleChoice:addMoreListMultipleChoice
}