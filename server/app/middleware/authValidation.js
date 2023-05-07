const { body, validationResult } = require("express-validator");
const { getUserFromDB } = require("../services/dbCheck.service");
const { ValidationError } = require("../utils/errorClasses");

const usernameValidate = body("username")
  .exists()
  .withMessage("Username is required")
  .isString()
  .withMessage("Username must be a string")
  .trim()
  .isLength({ min: 3, max: 20 })
  .withMessage("Username must be between 3 and 20 characters")
  .custom(async (value) => {
    const user = await getUserFromDB({ username: value });
    if (user) {
      return Promise.reject("This username is already registered");
    }
  });

const emailValidate = body("email")
  .exists()
  .withMessage("Email is required")
  .isString()
  .withMessage("Email must be a string")
  .trim()
  .isEmail()
  .normalizeEmail({ gmail_remove_dots: false })
  .withMessage("Email must be valid");

const emailCheckForDuplicates = body("email").custom(async (value) => {
  const user = await getUserFromDB({ email: value });
  if (user) {
    return Promise.reject("This email is already registered");
  }
});

const passwordValidate = body("password")
  .exists()
  .withMessage("Password is required")
  .matches(/^[a-zA-Zа-яА-Я0-9~!?@#$%^&*_\-+()[\]{}><\/\\|"'.,:;]+$/)
  .withMessage("Password contains invalid characters")
  .isLength({ min: 8, max: 64 })
  .withMessage("Password must be between 8 and 64 characters")
  .matches(/\d/)
  .withMessage("Password must contain at least one digit")
  .matches(/[a-zа-я]/)
  .withMessage("Password must contain at least one lowercase letter")
  .matches(/[A-ZА-Я]/)
  .withMessage("Password must contain at least one uppercase letter");

// An array of validators for user registration
const signupValidation = [
  usernameValidate,
  emailValidate,
  emailCheckForDuplicates,
  passwordValidate,
];

// An array of validators for user login
const loginValidation = [emailValidate, passwordValidate];

// A function to check the validation result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors)
  }
  next();
};

module.exports = {
  validateSignup: [signupValidation, validate],
  validateLogin: [loginValidation, validate],
};
