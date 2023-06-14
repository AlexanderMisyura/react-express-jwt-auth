import jwt_decode from "jwt-decode";

export function getAccessToken() {
  const access_token = localStorage.getItem("access_token");
  const refresh_expires_at = localStorage.getItem("refresh_expires_at");

  if (refresh_expires_at - 10000 < Date.now()) {
    throw new Error("refresh token expired");
  }

  if (!access_token) {
    throw new Error("no access token");
  }

  let accessExpirationTime;
  try {
    accessExpirationTime = jwt_decode(access_token).exp;
  } catch (err) {
    throw new Error("access token invalid");
  }
  if (accessExpirationTime * 1000 - 10000 < Date.now()) {
    console.log("access expired");
    throw new Error("access token expired");
  }

  return access_token;
}
