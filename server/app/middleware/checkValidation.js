const { body, validationResult } = require("express-validator");

const emailValidate = body("email")
  .trim()
  .isEmail()
  .normalizeEmail({ gmail_remove_dots: false });

const usernameValidate = body("username")
  .trim()
  .isLength({ min: 3, max: 20 })

const validate = (req, res, next) => {
  const errors = validationResult(req);
  console.log("errors", errors);
  req.isCredentialValid = true;
  if (!errors.isEmpty()) {
    req.isCredentialValid = false;
  }
  next();
};

async function validatorToggler(req, res, next) {
  const credential = Object.keys(req.body)[0];
  if (credential === "email") {
    await emailValidate.run(req);
  } else if (credential === "username") {
    await usernameValidate.run(req);
  }
  next();
}

module.exports = {
  validateCredential: [validatorToggler, validate],
};
