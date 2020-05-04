const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ message: "Bạn không có quyền truy cập, vui lòng đăng nhập" });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);

    // if (verified.active == 0) {
    //   return res
    //     .status(401)
    //     .send({ message: "Vui lòng kích hoạt tài khoản và đăng nhập lại" });
    // }
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).send({ message: "Token không hợp lệ" });
  }
};
