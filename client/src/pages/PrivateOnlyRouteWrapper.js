import { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const PrivateOnlyRouteWrapper = ({ requiredRole }) => {
  const { logoutUser, verifyAccess, user } = useAuthContext();
  // isAccesGranted - the access token is verified by the server
  const [isAccesGranted, setIsAccesGranted] = useState(false);
  const [data, setData] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    if (user) {
      const checkAccess = async (abortSignal) => {
        try {
          const data = await verifyAccess(requiredRole, abortSignal);
          setData(data.securedData);
          setIsAccesGranted(true);
        } catch (err) {
          if (err.name === "CanceledError") {
            console.log(
              `Request to /${err.config.url} was ${err.message} : ${err.config.signal.reason}`
            );
          } else {
            if (err?.response?.data?.error?.message) {
              console.log(err.response.data.error.message);
              if (err.response.data.error.name === "AccessError") {
                navigate("/", { replace: true });
                return;
              }
            } else {
              console.log(err);
            }
            await logoutUser();
          }
        }
      };
      checkAccess(controller.signal);
    }

    return () => {
      controller.abort("The component was unmounted");
    };
  }, [user, logoutUser, verifyAccess, navigate, requiredRole]);

  if (user && !isAccesGranted) {
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

  if (!isAccesGranted || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet context={[data]} />;
};

export default PrivateOnlyRouteWrapper;
