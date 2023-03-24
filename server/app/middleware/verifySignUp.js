const db = require("../models");

const checkDuplicateCredentials = async (req, res, next) => {
  try {
    const userByUsername = await db.user.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (userByUsername) {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    }

    const userByEmail = await db.user.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (userByEmail) {
      res.status(400).send({
        message: "Failed! Email is already in use!",
      });
      return;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};

const verifySignUp = {
  checkDuplicateCredentials,
};

module.exports = verifySignUp;
