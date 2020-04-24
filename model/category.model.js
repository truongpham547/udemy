var categorySchema = require('../schema/category.schema');

function addCategory(name,image){
    return new Promise((resolve,reject)=>{
        let category = new categorySchema();
        category.name = name;
        category.image=image;
        category.save().then(newCategory=>{
            return resolve(newCategory);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function deleteCategory(id){
    return new Promise((resolve,reject)=>{
        categorySchema.deleteOne({_id:id}).then(deletedCategory=>{
            return resolve(deletedCategory);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function updateCategory(id,name,image){
    return new Promise((resolve,reject)=>{
        categorySchema.findOneAndUpdate({_id:id},{name:name,image:image},{new:true}).then(newCategory=>{
            return resolve(newCategory);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function gets(){
    return new Promise((resolve,reject)=>{
        categorySchema.find().then(categories=>{
            return resolve(categories);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function get(id){
    return new Promise((resolve,reject)=>{
        categorySchema.findOne({_id:id}).then(category=>{
            return resolve(category);
        }).catch(err=>{
            return reject(err);
        })
    })
}

function isExist(name){
    return new Promise((resolve,reject)=>{
        categorySchema.findOne({name:name}).then(category=>{
            return resolve(category);
        }).catch(err=>{
            return reject(err);
        })
    })
}

module.exports={
  addCategory:addCategory,
  deleteCategory:deleteCategory,
  updateCategory:updateCategory,
  gets:gets,
  get:get,
  isExist:isExist
}