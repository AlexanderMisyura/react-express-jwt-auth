import { useAuthContext } from "../contexts/AuthContext";
import { useOutletContext } from "react-router-dom";
const Profile = () => {
  const { user } = useAuthContext();
  const [data] = useOutletContext();

  return (
    <main>
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            Profile
          </h3>
          <p className="text-gray-600">
            Hi, <span className="font-semibold">{user.name}</span>! You can see
            this page only if you are logged in.
          </p>
          <p className="text-gray-600">
            Data from the server:{" "}
            <span className="font-semibold">{data}</span>.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Profile;
