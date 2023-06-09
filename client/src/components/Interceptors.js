import { useEffect, useState } from "react";
import axios from "axios";
import { secureApi } from "../api/api";
import { useAuthContext } from "../contexts/AuthContext";

const Interceptors = ({ children }) => {
  const [areInterseptorsSet, setAreInterseptorsSet] = useState(false);
  const { logoutUser, refreshUserTokens } = useAuthContext();

  useEffect(() => {
    function setAuthHeader(config) {
      const access_token = localStorage.getItem("access_token");
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }

    // axios request interceptor
    const requestInterceptor = secureApi.interceptors.request.use(
      requestCb,
      requestErrorCb
    );

    async function requestCb(config) {
      setAuthHeader(config);
      return config;
    }

    function requestErrorCb(err) {
      return Promise.reject(err);
    }

    // axios response interceptor
    const responseInterceptor = secureApi.interceptors.response.use(
      responseCb,
      responseErrorCb
    );

    function responseCb(response) {
      return response;
    }
    async function responseErrorCb(err) {
      const originalRequest = err.config;
      if (
        err.response?.data?.error?.isRefetchNeeded &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        await refreshUserTokens();
        setAuthHeader(originalRequest);
        return await axios(originalRequest);
      }
      return Promise.reject(err);
    }

    setAreInterseptorsSet(true);

    return () => {
      secureApi.interceptors.request.eject(requestInterceptor);
      secureApi.interceptors.response.eject(responseInterceptor);
    };
  }, [logoutUser, refreshUserTokens]);

  return areInterseptorsSet && children;
};

export default Interceptors;
