import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const PrivateOnlyRouteWrapper = ({ requiredRole }) => {
  const { verifyAccess, user } = useAuthContext();
  // isAccessGranted - the access token is verified by the server
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [data, setData] = useState("");
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    if (user) {
      const checkAccess = async (abortSignal) => {
        const data = await verifyAccess(requiredRole, abortSignal);
        if (data) {
          setData(data.securedData);
          setIsAccessGranted(true);
        }
      };
      checkAccess(controller.signal);
    }

    return () => {
      controller.abort("The component was unmounted");
    };
  }, [user, verifyAccess, requiredRole]);

  if (user && !isAccessGranted) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
            Loading...
          </h3>
        </div>
      </div>
    );
  }

  if (!isAccessGranted || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet context={[data]} />;
};

export default PrivateOnlyRouteWrapper;
