const { verifyAccessToken } = require("../middleware").tokenVerification;
const accessController = require("../controllers/access.contorller");

const router = require("express").Router();

router.get("/access", verifyAccessToken, accessController.provideAccess);

module.exports = router;
