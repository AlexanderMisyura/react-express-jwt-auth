require("dotenv");

module.exports = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ISSUER: process.env.JWT_ISSUER,
  jwtAccessExpiresIn: 900, // 15 min
  jwtRefreshExpiresIn: 86400, // 24 hours
  userScope: "browse cart order profile review"
};
