const checkController = require("../controllers/check.controller");
const { sanitizeEmail } = require("../middleware").authValidation;

const router = require("express").Router();

router.post("/user", sanitizeEmail, checkController.checkUser);

module.exports = router;
