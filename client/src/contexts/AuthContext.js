import { createContext, useContext, useState, useCallback } from "react";
import jwt_decode from "jwt-decode";
import { signup, login, logout, refreshAccess, verify } from "../api/api";

export const AuthContext = createContext();

function getUserFromStorage() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return null;
  }
  try {
    const { name, email, roles } = jwt_decode(token);
    return { name, email, roles };
  } catch (err) {
    localStorage.removeItem("access_token");
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUserFromStorage());

  const signupUser = async (formData) => {
    try {
      const data = await signup(formData);
      if (data?.token_type === "Bearer") {
        localStorage.setItem("access_token", data.access_token);
        setUser(() => getUserFromStorage());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loginUser = async (formData) => {
    try {
      const data = await login(formData);
      if (data?.token_type === "Bearer") {
        localStorage.setItem("access_token", data.access_token);
        setUser(() => getUserFromStorage());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logoutUser = useCallback(async () => {
    localStorage.removeItem("access_token");
    setUser(null);
    await logout();
  }, []);

  const refreshUserTokens = useCallback(async () => {
    const newTokenData = await refreshAccess();
    localStorage.setItem("access_token", newTokenData.access_token);
  }, []);

  const verifyAccess = useCallback(async (role, abortSignal) => {
    try {
      const data = await verify(role, {
        signal: abortSignal,
      });
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signupUser,
        loginUser,
        logoutUser,
        refreshUserTokens,
        verifyAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
