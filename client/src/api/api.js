import axios from "axios";
import { baseURL } from "../constants";

const api = axios.create({
  baseURL,
});

export const checkUserExists = async (payload) => {
  try {
    const resp = await api.post("/check/user", payload);
    const { userExists } = resp.data;
    return userExists;
  } catch (err) {
    if (err.response) {
      throw new Error(`error checking duplicate credentials: ${err.response}`);
    }
  }
};
