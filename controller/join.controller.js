var joinSchema = require('../schema/join.schema');


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

module.exports = {
    joinCourse:joinCourse,
    getCoursesJoinedByIdUser:getCoursesJoinedByIdUser,
    getJoinCourseById:getJoinCourseById,
    updateJoin:updateJoin,
    deleteJoin:deleteJoin
}
