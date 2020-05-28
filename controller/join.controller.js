var joinSchema = require('../schema/join.schema');
var lessonProgressSchema = require('../schema/lessonProgress.schema');
var lessonSchema = require('../schema/lesson.schema');

function isJoined(idUser,idCourse){
    return new Promise((resolve,reject)=>{
        joinSchema.findOne({idUser:idUser,idCourse:idCourse}).then(join=>{
            if(join){
                return resolve(true);
            }else{
                return resolve(false);
            }
        }).catch(err=>{
            return reject(err);
        })
    })
}

function joinCourse(userData) {
    return new Promise((resolve, reject) => {
        isJoined(userData.idUser,userData.idCourse).then(result=>{
            if(result){
                return resolve({status:false,message:"Bạn đã từng tham gia khóa học"});
            }else{
                let join = new joinSchema();
                join.idUser = userData.idUser;
                join.idCourse = userData.idCourse;
                join.save().then(newJoin=>{
                    return resolve({data:newJoin,status:true});
                }).catch(err=>{
                    return reject(err);
                })
            }
        }).catch(err=>{
            return reject(err);
        })
    });
}

function getCoursesJoinedByIdUser(idUser){
    return new Promise((resolve,reject)=>{
        joinSchema.find({idUser:idUser})
        .populate({
            path: 'courses',
            select:'name'
        })         
        .populate("idCourse",["name","image"],"courses") 
        .then(joins=>{
            return resolve(joins);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function getJoinCourseById(id){
    return new Promise((resolve,reject)=>{
        joinSchema.findOne({_id:id}).then(join=>{
            return resolve(join);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function updateJoin(id,data){
    return new Promise((resolve,reject)=>{
        joinSchema.findOneAndUpdate({_id:id},{idUser:data.idUser,idCourse:data.idCourse},{new:true}).then(newJoin=>{
            return resolve(newJoin);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function deleteJoin(id){
    return new Promise((resolve,reject)=>{
        joinSchema.deleteOne({_id:id}).then(deletedJoin=>{
            return resolve(deletedJoin);
        }).catch(err=>{
            return reject(err);
        })
    })
}

async function updatePercentCourse(idCourse,idJoin){

    try {
        let numLessonOfCourse = await lessonSchema.countDocuments({idCourse:idCourse});
        let numLessonCompleted = await lessonProgressSchema.countDocuments({idJoin:idJoin});
        let percentCourseComplete = Math.round((numLessonCompleted/numLessonOfCourse)*100);
        return await joinSchema.findOneAndUpdate({_id:idJoin},{percentCompleted:percentCourseComplete},{new:true});
    } catch (error) {
        throw new Error(error);
    }
}

async function updateProgressLesson(idUser,idCourse,idLesson,data){
    try {
        let joinInfo = await joinSchema.findOne({ idUser:idUser,idCourse:idCourse});
        console.log(joinInfo._id);
        let lessonProgress = await lessonProgressSchema.findOne({idJoin:joinInfo._id,idLesson:idLesson});
        if(!lessonProgress){
            let insertProgress = new lessonProgressSchema();
            insertProgress.idLesson=idLesson;
            insertProgress.isCompleted=data.isCompleted;
            insertProgress.idJoin=joinInfo._id;
            try{
                let inserted = await insertProgress.save();
                let courseUpdated = await updatePercentCourse(idCourse,joinInfo._id);
                return courseUpdated;
            }catch(err){
                throw new Error(err);
            }

        }else{
            try {
                let updated =await lessonProgressSchema.findOneAndUpdate({idJoin:joinInfo._id,idLesson:idLesson},{isCompleted:data.isCompleted},{new:true});
                let courseUpdated = await updatePercentCourse(idCourse,joinInfo._id);
                return courseUpdated;
            } catch (error) {
                throw new Error(error);
            }
        }
        
    } catch (error) {
        throw new Error(error);
    }


    
}

function getProgressOfCourse(){
    return new Promise((resolve,reject))
}

module.exports = {
    joinCourse:joinCourse,
    getCoursesJoinedByIdUser:getCoursesJoinedByIdUser,
    getJoinCourseById:getJoinCourseById,
    updateJoin:updateJoin,
    deleteJoin:deleteJoin,
    updateProgressLesson:updateProgressLesson
}
