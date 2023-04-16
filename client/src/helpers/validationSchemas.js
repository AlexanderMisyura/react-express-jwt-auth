import { string, object } from "yup";
import { checkUserExists } from "../api/api";

async function checkDuplicateCredential(value) {
  try {
    const credentialName = this.path;
    const payload = { [credentialName]: value };
    const userExists = await checkUserExists(payload);
    // If user already exists (userExists = true)
    // than credentials are not unique => return false
    return !userExists;
  } catch (err) {
    this.createError({message: err.message})
  }
}

const username = string()
  .trim()
  .min(3, "Username must be between 3 and 20 characters")
  .max(20, "Username must be between 3 and 20 characters")
  .required("Username is required")
  .test(
    "checkUsernameForDuplicates",
    "This username is already registered",
    checkDuplicateCredential
  )

const emailSignup = string()
  .trim()
  .email("Invalid email adress")
  .required("Email is required")
  .test(
    "checkEmailForDuplicates",
    "This email is already registered",
    checkDuplicateCredential
  );

const emailLogin = string()
  .trim()
  .email("Invalid email adress")
  .required("Email is required");

const password = string()
  .matches(
    /[a-zA-Zа-яА-Я0-9~!?@#$%^&*_\-+()[\]{}></\\|"'.,:;]+$/,
    "Password contains invalid characters"
  )
  .min(8, "Password must be between 8 and 64 characters")
  .max(64, "Password must be between 8 and 64 characters")
  .matches(/\d/, "Password must contain at least one digit")
  .matches(/[a-zа-я]/, "Password must contain at least one lowercase letter")
  .matches(/[A-ZА-Я]/, "Password must contain at least one uppercase letter")
  .required("Password is required");

export const LoginValidationSchema = object().shape({
  email: emailLogin,
  password,
});

export const SignupValidationSchema = object().shape({
  username,
  email: emailSignup,
  password,
});
