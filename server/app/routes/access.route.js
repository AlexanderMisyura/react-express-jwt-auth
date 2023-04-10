const { verifyAccessToken, verifyRefreshToken } =
  require("../middleware").authJwt;
const accessController = require("../controllers/access.contorller");

const router = require("express").Router();

router.get("/access", verifyAccessToken, accessController.provideAccess);
router.get("/refresh", verifyRefreshToken, accessController.refreshAccess);

module.exports = router;
