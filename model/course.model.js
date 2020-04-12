var courseSchema = require("../schema/course.schema");
var fs = require("fs");
var path = require("path");

function create(data) {
  return new Promise((resolve, reject) => {
    try {
      var course = new courseSchema();
      course.name = data.name;
      course.idUser = data.iduser;
      course.image = data.image;
      course.goal = data.goal;
      course.description = data.description;
      course.category = data.category;
      course.price = data.price;
      course.discount = data.discount;
      return course
        .save()
        .then((course) => {
          return resolve(course);
        })
        .catch((err) => {
          return reject(course);
        });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

function update(data) {
  return new Promise((resolve, reject) => {
    try {
      if (data.image == null) {
        courseSchema
          .findOneAndUpdate(
            { _id: data.id, idUser: data.iduser },
            {
              name: data.name,
              goal: data.goal,
              description: data.description,
              category: data.category,
              price: data.price,
              discount: data.discount,
            }
          )
          .then((updated) => {
            updated.name = data.name;
            updated.goal = data.goal;
            updated.description = data.description;
            updated.category = data.category;
            updated.price = data.price;
            updated.discount = data.discount;
            resolve(updated);
          })
          .catch((err) => {
            return reject(course);
          });
      } else {
        courseSchema
          .findOneAndUpdate(
            { _id: data.id, idUser: data.iduser },
            {
              name: data.name,
              goal: data.goal,
              description: data.description,
              category: data.category,
              price: data.price,
              discount: data.discount,
              image: data.image,
            }
          )
          .then((updated) => {
            try {
              fs.unlinkSync(
                path.join(
                  __dirname,
                  "../public/upload/course_image/" + updated.image
                )
              );
            } catch (err) {}
            updated.image = data.image;
            updated.name = data.name;
            updated.goal = data.goal;
            updated.description = data.description;
            updated.category = data.category;
            updated.price = data.price;
            updated.discount = data.discount;
            resolve(updated);
          })
          .catch((err) => {
            return reject(course);
          });
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

function del(id, iduser) {
  return new Promise((resolve, reject) => {
    try {
      try {
        fs.unlinkSync(
          path.join(__dirname, "../public/upload/course_image/" + updated.image)
        );
      } catch (err) {}
      courseSchema.deleteOne({ _id: id, idUser: iduser }).then((result) => {
        if (result) resolve({ status: "success" });
        resolve({ status: "error" });
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
      .populate("idUser", "name")
      .populate("category", "name")
      .sort({ created_at: -1 })
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getbyCategory(idcategory) {
  return new Promise((resolve, reject) => {
    courseSchema
      .find({ category: idcategory })
      .populate("idUser", "name")
      .populate("category", "name")
      .sort({ created_at: -1 })
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getbyIduser(iduser) {
  return new Promise((resolve, reject) => {
    courseSchema
      .find({ idUser: iduser })
      .populate("idUser", "name")
      .populate("category", "name")
      .sort({ created_at: -1 })
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getfree() {
  return new Promise((resolve, reject) => {
    courseSchema
      .find({ price: 0 })
      .populate("idUser", "name")
      .populate("category", "name")
      .sort({ created_at: -1 })
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function gettop() {
  return new Promise((resolve, reject) => {
    courseSchema
      .find()
      .populate("idUser", "name")
      .populate("category", "name")
      .sort({ ranking: -1, created_at: -1 })
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

module.exports = {
  create: create,
  gets: gets,
  getbyCategory: getbyCategory,
  getbyIduser: getbyIduser,
  getfree: getfree,
  gettop: gettop,
  update: update,
  delete: del,
};
