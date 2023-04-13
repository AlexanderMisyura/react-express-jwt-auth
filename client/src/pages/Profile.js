const Profile = () => {
  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            Profile
          </h3>
          <p className="text-gray-600">
            You can see this page only if you are logged in.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Profile;
