require("dotenv");

module.exports = {
  secret: process.env.JWT_ACCESS_SECRET,
  iss: process.env.JWT_ISS,
};
