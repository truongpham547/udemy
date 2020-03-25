var courseSchema = require("../schema/course.schema");

function create(
  name,
  idUser,
  image,
  goal,
  description,
  category,
  price,
  discount
) {
  return new Promise((resolve, reject) => {
    try {
      var course = new courseSchema();
      course.name = name;
      course.idUser = idUser;
      course.image = image;
      course.goal = goal;
      course.description = description;
      course.category = category;
      course.price = price;
      course.discount = discount;
      return course
        .save()
        .then(course => {
          return resolve(course);
        })
        .catch(err => {
          return reject(course);
        });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

function gets() {
  return new Promise((resolve, reject) => {
    courseSchema
      .find()
      .then(courses => {
        return resolve(courses);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

function getbyCategory(idcategory) {
  return new Promise((resolve, reject) => {
    courseSchema
      .find({ category: idcategory })
      .then(courses => {
        return resolve(courses);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

function getfree() {
  return new Promise((resolve, reject) => {
    courseSchema
      .find({ price: 0 })
      .then(courses => {
        return resolve(courses);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

function gettop() {
  return new Promise((resolve, reject) => {
    courseSchema
      .find()
      .sort({ vote: -1 })
      .then(courses => {
        return resolve(courses);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

module.exports = {
  create: create,
  gets: gets,
  getbyCategory: getbyCategory,
  getfree: getfree,
  gettop: gettop
};
