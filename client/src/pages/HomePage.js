const HomePage = () => {
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            Home Page
          </h3>
          <p className="text-gray-600">
            This page is visible to all users, whether they are logged in or
            not.
          </p>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
