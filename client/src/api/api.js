import axios from "axios";
import { baseURL } from "../constants";

const api = axios.create({
  baseURL,
  withCredentials: true,
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
    const resp = await api.post("auth/signup", userData);
  } catch (err) {
    throw err.response;
  }
};

export const login = async (userData) => {
  try {
    const resp = await api.post("auth/login", userData);
    return resp.data;
  } catch (err) {
    throw err.response.data.message;
  }
};

export const logout = async () => {
  try {
    const resp = await api.get("auth/logout");
    return resp.data;
  } catch (err) {
    throw err.response.data.message;
  }
}
