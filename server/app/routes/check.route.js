const checkController = require("../controllers/check.controller");
const { validateCredential } = require("../middleware").checkValidation;

const router = require("express").Router();

router.post("/user", validateCredential, checkController.checkUser);

module.exports = router;
