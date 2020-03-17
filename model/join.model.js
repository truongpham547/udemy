var joinSchema = require('../schema/join.schema');

function createJoin(idUser,idCourse){
    return new Promise((resolve,reject)=>{
        let join = new joinSchema();
        join.idUser = idUser;
        join.idCourse = idCourse;
        join.save().then(newJoin=>{
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

function updateJoin(id,idUser,idCourse){
    return new Promise((resolve,reject)=>{
        joinSchema.findOneAndUpdate({_id:id},{idUser:idUser,idCourse:idCourse},{new:true}).then(newJoin=>{
            return resolve(newJoin);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function gets(){
    return new Promise((resolve,reject)=>{
        joinSchema.find().then(joins=>{
            return resolve(joins);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function get(id){
    return new Promise((resolve,reject)=>{
        joinSchema.findOne({_id:id}).then(join=>{
            return resolve(join);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function getCoursesJoinedByIdUser(idUser){
    return new Promise((resolve,reject)=>{
        joinSchema.findOne({idUser:idUser}).then(joins=>{
            return resolve(joins);
        }).catch(err=>{
            return reject(err);
        })
    })
}

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

module.exports={
    createJoin:createJoin,
    deleteJoin:deleteJoin,
    updateJoin:updateJoin,
    gets:gets,
    get:get,
    isJoined:isJoined,
    getCoursesJoinedByIdUser:getCoursesJoinedByIdUser
}