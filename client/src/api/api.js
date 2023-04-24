import axios from "axios";
import { baseURL } from "../constants";

const api = axios.create({
  baseURL,
});

export const checkUserExists = async (payload) => {
  try {
    const resp = await api.post("/check/user", payload);
    return resp.data;
  } catch (err) {
    if (err.response) {
      throw err.response;
    }
  }
};

export const signup = async (userData) => {
  try {
    const resp = await api.post("auth/signup", userData, {
      withCredentials: true,
      credentials: "same-origin",
    });
    console.log("resp", resp);
  } catch (err) {
    throw err.response;
  }
};

export const login = async (userData) => {
  try {
    const resp = await api.post("auth/login", userData, {
      withCredentials: true,
      credentials: "same-origin",
    });
    console.log("resp", resp);
  } catch (err) {
    throw err.response;
  }
};

// axios interceptor for adding access token to authorization header
// api.interceptors.request.use(
//   (req) => {
//     const accessToken = localStorage.getItem("access_token");
//     if (!accessToken) {
//       // make a request for getting new with refresh token
//       // if (!refresh_token) {
//       //   redirect to /login
//       // }
//     }

//     req.headers.Authorization = `Bearer ${token}`;
//     return req;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );
