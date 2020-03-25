const course = require("../schema/course.schema");
var courseModel = require("../model/course.model");
const fs = require("fs");
var path = require("path");

function createCourse(iduser, courseData, image) {
  return new Promise((resolve, reject) => {
    try {
      courseModel
        .create(
          courseData.name,
          iduser,
          (_image = "default"),
          courseData.goal,
          courseData.description,
          courseData.category,
          courseData.price,
          courseData.discount
        )
        .then(newCourse => {
          if (image) {
            console.log(image);
            image = image.image;
            imageName = newCourse.id + "course" + image.name;
            try {
              fs.unlink(
                path.join(
                  __dirname,
                  "../public/upload/course_image/" + imageName.image
                )
              );
            } catch (err) {}

            image.mv(
              path.join(
                __dirname,
                "../public/upload/course_image/" + imageName
              ),
              function(errImage) {
                if (errImage) {
                  resolve({ status: "error" });
                }
              }
            );
            course
              .findOneAndUpdate({ _id: newCourse.id }, { image: imageName })
              .then(updateCourse => {
                newCourse.image = imageName;
                resolve({
                  status: "success",
                  newCourse
                });
              });
          } else resolve({ status: "success", newCourse });
        })
        .catch(err => {
          resolve({ status: "error" });
        });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    courseModel
      .gets()
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
    courseModel
      .getbyCategory(idcategory)
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
    courseModel
      .getfree()
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
    courseModel
      .gettop()
      .then(courses => {
        return resolve(courses);
      })
      .catch(err => {
        return reject(err);
      });
  });
}

function deleteCourse(id, idUser) {
  return new Promise((resolve, reject) => {
    try {
      course.deleteOne({ _id: id, idUser: idUser }).then(result => {
        if (result) resolve({ status: "success" });
        else resolve({ status: "error" });
      });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function updateCourse(idUser, updateCourse, image) {
  return new Promise((resolve, reject) => {
    try {
      console.log(idUser);
      course
        .findOneAndUpdate(
          { _id: updateCourse.id, idUser: idUser },
          {
            name: updateCourse.name,
            goal: updateCourse.goal,
            description: updateCourse.description,
            category: updateCourse.category,
            price: updateCourse.price,
            discount: updateCourse.discount
          }
        )
        .then(result => {
          if (result) {
            if (image) {
              image = image.image;
              imageName = updateCourse.id + "course" + image.name;
              try {
                fs.unlink(
                  path.join(
                    __dirname,
                    "../public/upload/course_image/" + imageName.image
                  )
                );
              } catch (err) {}

              image.mv(
                path.join(
                  __dirname,
                  "../public/upload/course_image/" + imageName
                ),
                function(errImage) {
                  if (errImage) {
                    resolve({ status: "error" });
                  }
                }
              );
              course
                .findOneAndUpdate(
                  { _id: updateCourse.id },
                  { image: imageName }
                )
                .then(result => {
                  result.image = imageName;
                  resolve({
                    status: "success",
                    result
                  });
                });
            } else resolve({ status: "success", result });
          } else resolve({ status: "error" });
        });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

module.exports = {
  createCourse: createCourse,
  deleteCourse: deleteCourse,
  updateCourse: updateCourse,
  getCourses: getCourses,
  getbyCategory: getbyCategory,
  getfree: getfree,
  gettop: gettop
};
