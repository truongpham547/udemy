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
    return res.status(500).send(err);
  }
});

Router.delete("/:id", verifyToken, function(req, res, next) {
  try {
    CourseController.deleteCourse(req.params.id, req.user.id).then(result => {
      return res.status(200).send(result);
    });
  } catch (error) {
    return res.status(500).send(err);
  }
});

Router.put("/", verifyToken, function(req, res, next) {
  try {
    let courseData = req.body;
    let image = req.files;
    CourseController.updateCourse(req.user.id, courseData, image).then(
      result => {
        return res.status(200).send(result);
      }
    );
  } catch (error) {
    return res.status(500).send(err);
  }
});

module.exports = Router;
