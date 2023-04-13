const About = () => {
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            About Page
          </h3>
          <p className="text-gray-600">This page is also visible to anyone.</p>
          <p className="text-gray-600 text-left">
            This app consists of a frontend client built with React and a backend
            web api built with Express, Postgres and Sequelize. It implements
            login and signup functionality using access and refresh json web
            tokens.
          </p>
          <p className="text-gray-600 text-left"></p>
        </div>
      </div>
    </main>
  );
};

export default About;
