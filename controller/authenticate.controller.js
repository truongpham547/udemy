var userModel = require('../model/user.model');
var path = require('path');


function getSpecific(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function IsExistUser(email){
    return new Promise((resolve,reject)=>{
        userModel.IsExistUser(email).then(result=>{
            return resolve(result);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function register(userData,image){

    return new Promise((resolve,reject)=>{
        console.log("in control",userData);
        try {
            IsExistUser(userData.email).then(result=>{
                if(result == true){
                    resolve({status:"Email đã tồn tại"})
                }else{
                    var imageName="default";
                    console.log(image);
                    if(image){
                        image=image.image;
                        imageName=getSpecific(30)+image.name;
                        image.mv(path.join(__dirname,'../public/upload/user_image/'+imageName),function(errImage){
                            if(errImage){
                                reject(errImage);
                            }
                        });
                    }
        
                    userModel.create(userData.name,userData.email,userData.password,userData.phone,userData.address,userData.description,role="student",imageName,userData.gender).then(newUser=>{
                        resolve({status:"Đăng kí thành công",user:newUser});
                    }).catch(err=>{
                        return reject(err);
                    })
                }
            }).catch(err=>{
                reject(err);
            })
        } catch (error) {
            console.log(error);
            return reject(error);
        }

    });
}

module.exports={
    register:register
}