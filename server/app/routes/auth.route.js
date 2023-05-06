const { validateSignup, validateLogin } =
  require("../middleware").authValidation;
const { verifyRefreshToken } = require("../middleware").tokenVerification;

const authController = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/signup", validateSignup, authController.signup);

router.post("/login", validateLogin, authController.login);

router.get("/refresh", verifyRefreshToken, authController.refresh);

router.get("/logout", verifyRefreshToken, authController.logout);

module.exports = router;
