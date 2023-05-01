const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const authValidation = require("./authValidation");
const checkValidation = require("./checkValidation");
const errorHandler = require("./errorHandler");

module.exports = {
  authJwt,
  verifySignUp,
  authValidation,
  checkValidation,
  errorHandler,
};
