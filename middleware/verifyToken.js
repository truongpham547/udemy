const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader)
    return res.status(401).send({ message: "Authorization Required" });
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Authorization Required" });
  }
};
