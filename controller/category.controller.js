var categoryModel = require("../model/category.model");


function addCategory(userData) {
  return new Promise((resolve, reject) => {
    categoryModel.isExist(userData.name).then(result=>{
        if(result){
            return resolve({status:false,"message":"Danh mục đã tồn tại"});
        }else{
            categoryModel.addCategory(userData.name).then(newCategory=>{
                return resolve({status:true,category:newCategory});
            }).catch(err=>{
                return reject(err);
            })
        }
    }).catch(err=>{
        return reject(err);
    })
  });
}

function getCategory(id){
    return new Promise((resolve,reject)=>{
        categoryModel.get(id).then(category=>{
            return resolve(category);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function getCategories(){
    return new Promise((resolve,reject)=>{
        categoryModel.gets().then(categories=>{
            return resolve(categories);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function deleteCategory(id){
    return new Promise((resolve,reject)=>{
        categoryModel.deleteCategory(id).then(categoryDeleted=>{
            return resolve(categoryDeleted);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function updateCategory(id,userData){
    return new Promise((resolve,reject)=>{
        categoryModel.isExist(userData.name).then(result=>{
            if(result){
                return resolve({status:false,message:"danh mục đã tồn tại"});
            }else{
                categoryModel.updateCategory(id,userData.name).then(newCategory=>{
                    return resolve({status:true,category:newCategory});
                }).catch(err=>{
                    return reject(err);
                })
            }
        }).catch(err=>{
            return reject(err);
        })
    })
}


module.exports = {
    addCategory:addCategory,
    getCategory:getCategory,
    getCategories:getCategories,
    deleteCategory:deleteCategory,
    updateCategory:updateCategory
}
