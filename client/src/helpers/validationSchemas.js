import { string, object } from "yup";
import { checkUserExists } from "../api/api";

async function checkDuplicateCredential(value, ctx) {
  try {
    const credentialName = ctx.path;
    const payload = { [credentialName]: value };
    const { isCredentialValid, userExists } = await checkUserExists(payload);
    // The credential is available if it is valid and
    // if the user with such credential doesn't exists
    if (!isCredentialValid) {
      return ctx.createError({
        message: `This ${credentialName} is invalid`,
      });
    } else if (userExists) {
      return ctx.createError({
        message: `This ${credentialName} is already registered`,
      });
    }
    return true;
  } catch (err) {
    ctx.createError({ message: err.message });
  }
}

const username = string()
  .trim()
  .min(3, "Username must be between 3 and 20 characters")
  .max(20, "Username must be between 3 and 20 characters")
  .required("Username is required")
  .test({
    name: "checkDuplicates",
    test: (value, ctx) => checkDuplicateCredential(value, ctx),
  });

const emailSignup = string()
  .trim()
  .email("Email must be valid")
  .required("Email is required")
  .test({
    name: "checkDuplicates",
    test: (value, ctx) => checkDuplicateCredential(value, ctx),
  });

const emailLogin = string()
  .trim()
  .email("Email must be valid")
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
