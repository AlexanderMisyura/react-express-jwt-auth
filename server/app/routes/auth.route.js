const { validateSignup, validateLogin } =
  require("../middleware").authValidation;
const { checkDuplicateCredentials } = require("../middleware").verifySignUp;
const { verifyRefreshToken } = require("../middleware").authJwt;

const authController = require("../controllers/auth.controller");

const router = require("express").Router();

router.post(
  "/signup",
  validateSignup,
  checkDuplicateCredentials,
  authController.signup
);

router.post("/login", validateLogin, authController.login);

router.get("/refresh", verifyRefreshToken, authController.refresh);

module.exports = router;
