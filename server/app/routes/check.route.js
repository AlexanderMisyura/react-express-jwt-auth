const checkController = require("../controllers/check.controller");

const router = require("express").Router();

router.get("/user", checkController.checkUser);

module.exports = router;
