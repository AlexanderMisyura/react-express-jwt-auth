const { verifyToken } = require("../middleware").authJwt;
const accessController = require("../controllers/access.contorller");

const router = require("express").Router();

const setHeader = (req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
};

router.get("/products", setHeader, accessController.allAccess);
router.get("/checkout", setHeader, verifyToken, accessController.loggedInAccess);

module.exports = router;
