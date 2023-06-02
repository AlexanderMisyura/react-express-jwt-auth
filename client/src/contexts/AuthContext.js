import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import jwt_decode from "jwt-decode";
import { signup, login, logout, refreshAccess, verify } from "../api/api";

export const AuthContext = createContext();

function getUserFromStorage() {
  const token = localStorage.getItem("access");
  if (!token) {
    return null;
  }
  try {
    const { name, email, roles } = jwt_decode(token);
    return { name, email, roles };
  } catch (err) {
    localStorage.removeItem("access");
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUserFromStorage());

  const signupUser = async (formData) => {
    try {
      const data = await signup(formData);
      if (data?.token_type === "Bearer") {
        const { access_expires_at, access_token, refresh_expires_at } = data;
        localStorage.setItem(
          "access",
          JSON.stringify({ access_token, access_expires_at })
        );
        localStorage.setItem("refresh", JSON.stringify({ refresh_expires_at }));
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
        const { access_expires_at, access_token, refresh_expires_at } = data;
        localStorage.setItem(
          "access",
          JSON.stringify({ access_token, access_expires_at })
        );
        localStorage.setItem("refresh", JSON.stringify({ refresh_expires_at }));
        setUser(() => getUserFromStorage());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logoutUser = useCallback(async () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    await logout();
  }, []);

  // Retrieve tokens from localStorage, check their expiration date, and refresh the access token if necessary.
  const validatedToken = async () => {
    const access = JSON.parse(localStorage.getItem("access"));
    const refresh = JSON.parse(localStorage.getItem("refresh"));
    if (!access || !refresh) {
      throw new Error("no access or refresh token");
    }

    const { access_expires_at, access_token } = access;
    const { refresh_expires_at } = refresh;
    if (!access_token || !access_expires_at || !refresh_expires_at) {
      throw new Error("no access or refresh token");
    }

    // The tokens are considered expired if there are less than 10 seconds left before their expiration date
    const accessExpired =
      Date.now() >= new Date(access_expires_at).getTime() - 10000;
    const refreshExpired =
      Date.now() >= new Date(refresh_expires_at).getTime() - 10000;

    if (refreshExpired) {
      throw new Error("refresh token expired");
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
      setUser(() => getUserFromStorage());
      return access_token;
    }
    return access_token;
  };

  const verifyAccess = useCallback(async (role, abortSignal) => {
    try {
      const access_token = await validatedToken();
      const res = await verify(role, {
        headers: { Authorization: `Bearer ${access_token}` },
        signal: abortSignal,
      });
      return res.data;
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
        verifyAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
