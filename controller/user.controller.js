const User = require("../schema/user.schema");
const bcrypt = require("bcryptjs");
var fs = require("fs");
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
                  user.password = hashed;
                  resolve({ status: "success", user });
                })
              );
            } catch (error) {
              resolve({ status: "error" });
            }
          } else {
            resolve({ status: "no match" });
          }
        });
      });
    } catch (error) {
      resolve({ status: "error" });
    }
  });
}

function changeAvatar(id, _image) {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate({ _id: id }, { image: _image }).then(user => {
        try {
          fs.unlinkSync(
            path.join(__dirname, "../public/upload/user_image/" + user.image)
          );
        } catch (err) {}
        if (!user) resolve({ status: "error" });
        user.image = _image;
        resolve({ status: "success", user });
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
        user.name = data.name;
        user.phone = data.phone;
        user.address = data.address;
        user.description = data.description;
        user.gender = data.gender;
        resolve({ status: "success", user });
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
