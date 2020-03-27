var Router = require("express").Router();
var jwt = require("jsonwebtoken");
var authenticateController = require("../../controller/authenticate.controller");
var authenticate = require("../../config/authenticate");
var verifyToken = require("../../middleware/verifyToken");
var userController = require("../../controller/user.controller");
var multer  = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload/user_image')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix+'-'+file.originalname )
  }
})

var upload = multer({ storage: storage });


Router.post("/login", function(req, res, next) {
  authenticate(req.body, res, next)
    .then(user => {
      if (user == null) {
        return res
          .status(401)
          .send({ message: "Mật khẩu hoặc Email không hợp lệ" });
      } else {
        const token = jwt.sign(
          { id: user._id, role: user.role,active:user.active},
          process.env.TOKEN_SECRET
        );
        res.clearCookie("jwt");
        return res
          .status(200)
          .header("auth-token", token)
          .send(user);
      }
    })
    .catch(err => {
      return res.status(500).send({ message: "Lỗi server" });
    });
});

Router.post("/register",upload.single('image'), function(req, res, next) {
  try {
    let userData = req.body;
    let image = req.file;
    if(req.file==undefined){
      image=undefined;
    }else{
      image=req.file.fieldname;
    }
    authenticateController
      .register(userData, image)
      .then(result => {
        if (result.user == null) {
          return res.status(500).send(result);
        } else {
          const token = jwt.sign(
            { id: result.user._id, role: result.user.role },
            process.env.TOKEN_SECRET
          );
          res.clearCookie("jwt");
          return res
            .status(200)
            .header("auth-token", token)
            .send(result.user);
        }
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send({ message: "Lỗi server" });
      });
  } catch (error) {
    console.log(error);
  }
});

Router.put("/change-password", verifyToken, function(req, res, next) {
  try {
    let data = req.body;
    userController
      .changePassword(req.user.id, data.oldpassword, data.newpassword)
      .then(result => {
        return res.status(200).send(result);
      });
  } catch (error) {
    return res.status(500).send(err);
  }
});

Router.post("/active-account", (req, res, next) => {
  authenticateController
    .activeAccount(req.body)
    .then(result => {
      if (result.status) {
        return res.status(200).send(result.user);
      } else {
        return res.status(500).send({ message: result.message });
      }
    })
    .catch(err => {
      return res.status(500).send({ message: "Lỗi server" });
    });
});

Router.post("/forgot-password", (req, res, next) => {
  let data = req.body;
  authenticateController
    .forgotPassword(data)
    .then(result => {
      if (result.status) {
        res.status(200).send({ message: result.message });
      } else {
        res.status(500).send({ message: result.message });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Lỗi server" });
    });
});

Router.post("/reset-password", (req, res, next) => {
  let data = req.body;
  authenticateController
    .resetPassword(data)
    .then(result => {
      if (result.status) {
        return res.status(200).send(result.user);
      } else {
        return res.status(500).send({ message: result.message });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: "Lỗi server" });
    });
});

Router.get('/logout',(req,res,next)=>{
  res.cookie('jwt', 'loggedout', {
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
});


module.exports = Router;
