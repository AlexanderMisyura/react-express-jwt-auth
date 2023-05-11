import { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { login, logout } from "../api/api";

export const AuthContext = createContext();

function getUserFromStorage() {
  const token = localStorage.getItem("access");
  if (!token) {
    return null;
  }
  try {
    const { name, email } = jwt_decode(token);
    return { name, email };
  } catch (err) {
    localStorage.removeItem("access");
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access")
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = getUserFromStorage();
    setUser(user);
  }, [isAuthenticated]);

  const loginUser = async (formData) => {
    try {
      const { access_expires_at, access_token, refresh_expires_at } =
        await login(formData);
      localStorage.setItem(
        "access",
        JSON.stringify({ access_token, access_expires_at })
      );
      localStorage.setItem("refresh", JSON.stringify({ refresh_expires_at }));
      setIsAuthenticated(true);
    } catch (err) {
      console.log("error from AuthContext", err);
    }
  };

  const logoutUser = async () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    await logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loginUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
