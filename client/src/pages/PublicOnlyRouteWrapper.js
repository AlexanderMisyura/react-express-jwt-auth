import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const PublicOnlyRouteWrapper = () => {
  const { user } = useAuthContext();

  if (user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PublicOnlyRouteWrapper;
