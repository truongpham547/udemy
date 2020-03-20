const bcrypt = require("bcryptjs");

// Load User model
const User = require("../schema/user.schema");

module.exports = function(req, res, next) {
  return new Promise((resolve, reject) => {
    const email = req.email;
    const password = req.password;
    User.findOne({
      email: email
    }).then(user => {
      if (!user) {
        return resolve(null);
      }
      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        if (isMatch) {
          return resolve(user);
        } else {
          return resolve(null);
        }
      });
    });
  });
};
