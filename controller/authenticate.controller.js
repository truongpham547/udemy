var userModel = require("../model/user.model");
var path = require("path");
var mailer = require('../helper/mailer');

function getSpecific(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function IsExistUser(email) {
  return new Promise((resolve, reject) => {
    userModel
      .IsExistUser(email)
      .then(result => {
        return resolve(result);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

function register(userData, image) {
  return new Promise((resolve, reject) => {
    console.log("in control", userData);
    try {
      IsExistUser(userData.email)
        .then(result => {
          if (result == true) {
            resolve({ message: "Email đã tồn tại" });
          } else {
            var imageName = "default.jpg";
            console.log(image);
            if(image!=undefined){
              imageName=image;
            }

            userModel
              .create(
                userData.name,
                userData.email,
                userData.password,
                userData.phone,
                userData.address,
                userData.description,
                (role = "student"),
                imageName,
                userData.gender
              )
              .then(newUser => {
                //send mail to with token to active
                let mailToken= getSpecific(6);
                mailer.sendMail(userData.email,"Kích hoạt tài khoản","Vui lòng quay về trang web hoặc ứng dụng điện thoại và nhấn vào mục kích hoạt sau đó nhập email và token như sau: "+mailToken).then(result=>{
                  userModel.updateTokenActiveByEmail(userData.email,mailToken).then(userUpdated=>{
                    resolve({ message: "Đăng kí thành công", user: newUser });
                  }).catch(err=>{
                    reject(err);
                  })
                }).catch(err=>{
                  reject(err);
                })
              })
              .catch(err => {
                return reject(err);
              });
          }
        })
        .catch(err => {
          reject(err);
        });
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
}

function forgotPassword(userData){
  return new Promise((resolve,reject)=>{
    IsExistUser(userData.email).then(result=>{
      if(result){
        let mailToken= getSpecific(6);
        mailer.sendMail(userData.email,"Quên mật khẩu","Vui lòng quay lại giao diện Web hoặc App để nhập mật khẩu mới kèm với Token sau: "+mailToken).then(result=>{
          userModel.updateTokenResetPasswordByEmail(userData.email,mailToken).then(user=>{
            resolve({status:true,"message":"đã gửi mail thành công"});
          }).catch(err=>{
            reject(err);
          })
        }).catch(err=>{
          reject(err);
        })
      }else{
        return resolve({status:false,"message":"email không tồn tại"});
      }
    }).catch(err=>{
      reject(err)
    })
  })
}

function activeAccount(userData){
  return new Promise((resolve,reject)=>{
    IsExistUser(userData.email).then(result=>{
      if(result){
        userModel.getByEmail(userData.email).then(user=>{
          if(user.activeToken==userData.activeToken){
            userModel.activeAccountByEmail(userData.email).then(userActive=>{
              return resolve({status:true,user:userActive});
            }).catch(err=>{
              return reject(err);
            })
          }else{
            return resolve({status:false,message:"token không hợp lệ"});
          }
        }).catch(err=>{
          reject(err);
        })
      }else{
        resolve({status:false,message:"email không tồn tại"})
      }
    })
  })
}

function resetPassword(userData){
  return new Promise((resolve,reject)=>{
    IsExistUser(userData.email).then(result=>{
      if(result){
        userModel.getByEmail(userData.email).then(user=>{
          if(user.resetPasswordRoken==userData.token){
            userModel.updatePasswordByEmail(userData.email,userData.password).then(user=>{
              resolve({status:true,user:user});
            }).catch(err=>{
              reject(err);
            })
          }else{
            return resolve({status:false,message:"token không hợp lệ"});
          }
        }).catch(err=>{
          reject(err);
        })
      }else{
        resolve({status:false,message:"email không tồn tại"})
      }
    })
  })
}

module.exports = {
  register: register,
  activeAccount:activeAccount,
  forgotPassword:forgotPassword,
  resetPassword:resetPassword
};
