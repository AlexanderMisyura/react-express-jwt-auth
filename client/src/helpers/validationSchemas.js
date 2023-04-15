import * as Yup from "yup";

const username = Yup.string()
  .trim()
  .min(3, "Username must be between 3 and 20 characters")
  .max(20, "Username must be between 3 and 20 characters")
  .required("Username is required");

const email = Yup.string()
  .trim()
  .email("Invalid email adress")
  .required("Email is required")

const password = Yup.string()
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

export const LoginValidationSchema = Yup.object().shape({
  email,
  password,
});

export const SignupValidationSchema = Yup.object().shape({
  username,
  email,
  password,
});
