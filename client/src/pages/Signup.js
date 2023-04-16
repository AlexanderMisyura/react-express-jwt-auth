import { Formik, Form, Field, ErrorMessage } from "formik";
import { SignupValidationSchema } from "../helpers/validationSchemas";

const Signup = () => {
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
            Register a new account
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto">
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={SignupValidationSchema}
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div className="flex flex-col w-96 gap-y-5">
                  <div>
                    <label className="font-medium" htmlFor="username">
                      Username
                    </label>
                    <Field
                      name="username"
                      id="username"
                      type="text"
                      className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                    />
                    <ErrorMessage
                      className="text-red-400"
                      name="username"
                      component="div"
                    />
                  </div>
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
                  className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                  type="submit"
                  disabled={isSubmitting}
                >
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

export default Signup;
