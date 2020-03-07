var userSchema = require("../schema/course.schema");

function create(
  name,
  idUser,
  background,
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
      course.background = background;
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

module.exports = {
  create: create
};