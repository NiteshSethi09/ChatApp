const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies["access_token"];
  // console.log(token);
  if (!token)
    return res.status(401).send("Access denied! No specific token provided.");
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATEKEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token!");
  }
};
