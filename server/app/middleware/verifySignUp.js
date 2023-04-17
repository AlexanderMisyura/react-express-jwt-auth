const { getUserFromDB } = require("../services/dbCheck.service");

const checkDuplicateCredentials = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userByUsername = await getUserFromDB({ username });
    if (userByUsername) {
      return res.status(400).send({
        message: "Failed! Username is already in use!",
      });
    }

    const userByEmail = await getUserFromDB({ email });
    if (userByEmail) {
      return res.status(400).send({
        message: "Failed! Email is already in use!",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Something went wrong!",
    });
  }
};

module.exports = {
  checkDuplicateCredentials,
};
