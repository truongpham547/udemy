const course = require("../schema/course.schema");
var courseModel = require("../model/course.model");
const fs = require("fs");
var path = require("path");

function createCourse(data) {
  return new Promise((resolve, reject) => {
    try {
      courseModel
        .create(data)
        .then((newCourse) => {
          if (!newCourse) {
            resolve({ status: "error DB" });
          }
          resolve({ status: "success", newCourse });
        })
        .catch((err) => {
          resolve({ status: "error", err });
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
    courseModel
      .getbyCategory(idcategory)
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
    courseModel
      .getbyIduser(iduser)
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getbyId(id) {
  return new Promise((resolve, reject) => {
    courseModel
      .getbyId(id)
      .then((course) => {
        return resolve(course);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function getfree() {
  return new Promise((resolve, reject) => {
    courseModel
      .getfree()
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
    courseModel
      .gettop()
      .then((courses) => {
        return resolve(courses);
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

function deleteCourse(id, iduser) {
  return new Promise((resolve, reject) => {
    try {
      courseModel.delete(id, iduser).then((result) => {
        resolve(result);
      });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function updateCourse(data) {
  return new Promise((resolve, reject) => {
    try {
      courseModel
        .update(data)
        .then((updated) => {
          if (!updated) {
            resolve({ status: "error DB" });
          }
          resolve({ status: "success", updated });
        })
        .catch((err) => {
          resolve({ status: "error", err });
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
  getbyIduser: getbyIduser,
  getfree: getfree,
  gettop: gettop,
  getbyId: getbyId,
};
