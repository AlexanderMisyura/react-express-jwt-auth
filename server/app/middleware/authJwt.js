const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

const verifyToken = (req, res, next) => {
  const token = req.headers["Authorization"]?.split(" ")?.[1];

  if (!token) {
    return res.status(403).json({ message: "No token" });
  }

  jwt.verify(token, config.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = decoded.id;

    next();
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
