const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const CourseController = require("../../controller/course.controller");

Router.post("/create", verifyToken, function(req, res, next) {
  try {
    let courseData = req.body;
    let image = req.files;
    CourseController.createCourse(req.user.id, courseData, image).then(
      result => {
        return res.status(200).send(result);
      }
    );
  } catch (error) {
    return res.status(500).send({ status: "error" });
  }
});

Router.get("/get-all", function(req, res, next) {
  CourseController.getCourses()
    .then(courses => {
      return res.status(200).send(courses);
    })
    .catch(err => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/getby-category/:idcategory", function(req, res, next) {
  CourseController.getbyCategory(req.params.idcategory)
    .then(courses => {
      return res.status(200).send(courses);
    })
    .catch(err => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/get-free", function(req, res, next) {
  CourseController.getfree()
    .then(courses => {
      return res.status(200).send(courses);
    })
    .catch(err => {
      return res.status(500).send({ status: "error" });
    });
});

Router.get("/get-top", function(req, res, next) {
  CourseController.gettop()
    .then(courses => {
      return res.status(200).send(courses);
    })
    .catch(err => {
      return res.status(500).send({ status: "error" });
    });
});

Router.delete("/delete/:id", verifyToken, function(req, res, next) {
  try {
    CourseController.deleteCourse(req.params.id, req.user.id).then(result => {
      return res.status(200).send(result);
    });
  } catch (error) {
    return res.status(500).send({ status: "error" });
  }
});

Router.put("/update/:id", verifyToken, function(req, res, next) {
  try {
    let courseData = req.body;
    let image = req.files;
    courseData.id = req.params.id;
    CourseController.updateCourse(req.user.id, courseData, image).then(
      result => {
        return res.status(200).send(result);
      }
    );
  } catch (error) {
    return res.status(500).send({ status: "error" });
  }
});

module.exports = Router;
