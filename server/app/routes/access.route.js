const {
  tokenVerification: { verifyAccessToken },
  checkRole,
} = require("../middleware");

const accessController = require("../controllers/access.contorller");

const router = require("express").Router();

router.get(
  "/user-access",
  verifyAccessToken,
  checkRole("user"),
  accessController.provideUserAccess
);

router.get(
  "/admin-access",
  verifyAccessToken,
  checkRole("admin"),
  accessController.provideAdminAccess
);

module.exports = router;
