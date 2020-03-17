var joinModel = require("../model/join.model");


function joinCourse(userData) {
    return new Promise((resolve, reject) => {
        joinModel.isJoined(userData.idUser,userData.idCourse).then(result=>{
            if(result){
                return resolve({status:false,message:"Bạn đã từng tham gia khóa học"});
            }else{
                joinModel.createJoin(userData.idUser,userData.idCourse).then(newJoin=>{
                    return resolve({status:true,newJoin:newJoin});
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
        joinModel.getCoursesJoinedByIdUser(idUser).then(joins=>{
            return resolve(joins);
        }).catch(err=>{
            return reject(err);
        })
    })
}



module.exports = {
    joinCourse:joinCourse,
    getCoursesJoinedByIdUser:getCoursesJoinedByIdUser
}
