import { Formik, Form, Field, ErrorMessage } from "formik";
import { LoginValidationSchema } from "../helpers/validationSchemas";

const Login = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 3000);
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
            {({ isSubmitting, isValid }) => (
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
                    <Field
                      name="password"
                      id="password"
                      type="password"
                      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
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
                  disabled={isSubmitting || !isValid}
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
                        stroke-width="4"
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
};

export default Login;
