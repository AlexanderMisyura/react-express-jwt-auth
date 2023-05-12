import { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { login, logout, refreshAccess, verify } from "../api/api";

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

  // Retrieve tokens from localStorage, check their expiration date, and refresh the access token if necessary.
  const validatedToken = async () => {
    const access = JSON.parse(localStorage.getItem("access"));
    const refresh = JSON.parse(localStorage.getItem("refresh"));
    if (!access || !refresh) {
      await logoutUser();
    }

    const { access_expires_at, access_token } = access;
    const { refresh_expires_at } = refresh;
    if (!access_token || !access_expires_at || !refresh_expires_at) {
      await logoutUser();
    }

    // The tokens are considered expired if there are less than 10 seconds left before their expiration date
    const accessExpired =
      access_expires_at < new Date(Date.now() - 10000).toISOString();
    const refreshExpired =
      refresh_expires_at < new Date(Date.now() - 10000).toISOString();

    if (refreshExpired) {
      await logoutUser();
    }

    if (accessExpired) {
      // Refresh the access token
      const { access_expires_at, access_token, refresh_expires_at } =
        await refreshAccess();
      localStorage.setItem(
        "access",
        JSON.stringify({ access_token, access_expires_at })
      );
      localStorage.setItem("refresh", JSON.stringify({ refresh_expires_at }));
      setIsAuthenticated(true);
      return access_token;
    }
    return access_token;
  };

  const verifyAccess = async () => {
    try {
      const access_token = await validatedToken();
      const res = await verify({
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loginUser, logoutUser, verifyAccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
