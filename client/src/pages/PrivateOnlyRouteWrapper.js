import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const PrivateOnlyRouteWrapper = () => {
  // isAuthenticated - the user is logged in
  const { verifyAccess, isAuthenticated } = useAuthContext();
  // isAccesGranted - the access token is verified by the server
  const [isAccesGranted, setIsAccesGranted] = useState(false);
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const checkAccess = async () => {
          const resp = await verifyAccess();
          setData(resp.data);
          setIsAccesGranted(true);
          setIsLoading(false);
        };
        checkAccess();
      } catch (err) {
        console.log("err", err);
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, verifyAccess]);

  if (isAuthenticated && isLoading) {
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

  // isAuthenticated means the user is logged in
  // isAccesGranted means the access token is verified by the server
  if (!isAccesGranted || !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet context={[data]} />;
};

export default PrivateOnlyRouteWrapper;
