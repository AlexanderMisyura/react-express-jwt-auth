import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { LoginValidationSchema } from "../helpers/validationSchemas";
import { useAuthContext } from "../contexts/AuthContext";

const Login = () => {
  const { loginUser } = useAuthContext();
  const location = useLocation();
  const from = location.state?.from || -1;
  const navigate = useNavigate();
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await loginUser(values);
      setSubmitting(false);
      navigate(from);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordRevealed((prevState) => !prevState);
  };

  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 h-screen flex justify-center flex-col text-gray-600 md:px-8">
        <div className="max-w-lg mx-auto space-y-3 sm:text-center">
          <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Log into an existing account
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginValidationSchema}
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-5">
                <div className="flex flex-col w-96 gap-y-5">
                  <div>
                    <label className="font-medium" htmlFor="email">
                      Email
                    </label>
                    <Field
                      name="email"
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                    <ErrorMessage
                      className="text-red-400"
                      name="email"
                      component="div"
                    />
                  </div>
                  <div>
                    <label className="font-medium" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        id="password"
                        type={isPasswordRevealed ? "text" : "password"}
                        autoComplete="current-password"
                        className="w-full mt-2 pl-3 pr-11 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                      />
                      {values.password &&
                        (isPasswordRevealed ? (
                          <BsFillEyeSlashFill
                            onClick={togglePasswordVisibility}
                            title="hide password"
                            className="absolute right-3 bottom-2 text-2xl text-gray-300 cursor-pointer"
                          />
                        ) : (
                          <BsFillEyeFill
                            onClick={togglePasswordVisibility}
                            title="show password"
                            className="absolute right-3 bottom-2 text-2xl text-gray-300 cursor-pointer"
                          />
                        ))}
                    </div>

                    <ErrorMessage
                      className="text-red-400"
                      name="password"
                      component="div"
                    />
                  </div>
                </div>
                <button
                  className="disabled:opacity-75 w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Submit
                </button>
                <p className="text-center">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
};

export default Login;
