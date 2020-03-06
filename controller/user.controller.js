const User = require("../schema/user.schema");
const bcrypt = require("bcryptjs");
const fs = require("fs");
var path = require("path");

function changePassword(id, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ _id: id }).then(user => {
        if (!user) {
          resolve({ status: "error" });
        }
        bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
          if (err) {
            resolve({ status: "error" });
          }
          if (isMatch) {
            try {
              bcrypt.hash(newPassword, bcrypt.genSaltSync(10)).then(hashed =>
                User.findOneAndUpdate(
                  { _id: id },
                  {
                    password: hashed
                  }
                ).then(user => {
                  resolve({ message: "Cap nhat thanh cong" });
                })
              );
            } catch (error) {
              resolve({ status: "error" });
            }
          } else {
            resolve({ message: "Mat khau hien tai khong khop" });
          }
        });
      });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function changeAvatar(id, image) {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ _id: id }).then(user => {
        if (!user) {
          resolve({ status: "error" });
        }
        if (user.image != "default") {
          fs.unlink(
            path.join(__dirname, "../public/upload/user_image/" + user.image),
            err => {
              if (err) {
                resolve({ status: "error" });
              }
            }
          );
        }
        image = image.image;
        imageName = id + image.name;
        image.mv(
          path.join(__dirname, "../public/upload/user_image/" + imageName),
          function(errImage) {
            if (errImage) {
              resolve({ status: "error" });
            }
          }
        );
        User.findOneAndUpdate({ _id: id }, { image: imageName }).then(user => {
          resolve({ status: "Cap nhat thanh cong" });
        });
      });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function changeProfile(id, data) {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate(
        { _id: id },
        {
          name: data.name,
          phone: data.phone,
          address: data.address,
          description: data.description,
          gender: data.gender
        }
      ).then(user => {
        resolve({ message: "Cap nhat thanh cong" });
      });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

module.exports = {
  changePassword: changePassword,
  changeAvatar: changeAvatar,
  changeProfile: changeProfile
};
