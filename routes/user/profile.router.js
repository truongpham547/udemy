const Router = require("express").Router();
const verifyToken = require("../../middleware/verifyToken");
const userController = require("../../controller/user.controller");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/upload/user_image");
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

var upload = multer({ storage: storage });

Router.put("/change-avatar", verifyToken, upload.single("image"), function(
  req,
  res,
  next
) {
  try {
    let image;
    if (req.file == undefined) {
      return res.status(200).send({ status: "fail" });
    } else {
      image = req.file.filename;
    }
    userController.changeAvatar(req.user.id, image).then(result => {
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

Router.put("/change-profile", verifyToken, function(req, res, next) {
  try {
    let data = req.body;
    console.log(data);
    userController.changeProfile(req.user.id, data).then(result => {
      return res.status(200).send(result);
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = Router;
