var userSchema = require('../schema/user.schema');
var bcrypt = require('bcryptjs');

function IsExistUser(email){
    return new Promise((resolve,reject)=>{
        userSchema.findOne({email:email}).then(user=>{
            if(user){
                return resolve(true);
            }else{
                return resolve(false)
            }
        }).catch(err=>{
            return reject(err);
        })
    })
}

function create(name,email,password,phone,address,description,role,image="default",gender){
    return new Promise((resolve,reject)=>{
        console.log("adad",password,email);
        try{
            var user = new userSchema();
            user.name=name;
            user.email=email;
            user.password=password;
            user.phone=phone;
            user.address=address;
            user.description=description;
            user.role=role;
            user.image=image;
            user.gender=gender;
            return bcrypt.hash(password,bcrypt.genSaltSync(10))
                .then(hashed=>{
                    user.password=hashed;
                        return user.save().
                            then(user=>{
                                return resolve(user);
                            })
                            .catch(err=>{
                                return reject(err);
                            });
                }).catch(err=>{
                    reject(err);
                })
        }catch(err){
            console.log(err);
            reject(err);
        }
    })
}

module.exports={
    IsExistUser:IsExistUser,
    create:create
}