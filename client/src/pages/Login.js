const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <main className="">
      <div className="max-w-screen-xl mx-auto px-4 h-screen flex justify-center flex-col text-gray-600 md:px-8">
        <div className="max-w-lg mx-auto space-y-3 sm:text-center">
          <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Log into an existing account
          </p>
        </div>
        <div className="mt-12 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col  gap-y-5">
              <div>
                <label className="font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  required
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                />
              </div>
              <div>
                <label className="font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  name="password"
                  id="password"
                  type="password"
                  required
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                />
              </div>
            </div>
            <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
              Submit
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
