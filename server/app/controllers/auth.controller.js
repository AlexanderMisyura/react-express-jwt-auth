const { UNAUTHORIZED, INTERNAL_SERVER_ERROR, OK } =
  require("http-status-codes").StatusCodes;
const { User } = require("../models");
const {
  generateTokens,
  revokeRefreshToken,
} = require("../services/token.service");
const authConfig = require("../config/auth.config");
const CustomError = require("../utils/CustomError");
const asyncWrapper = require("../utils/asyncWrapper");

function getTokensExpirationDates() {
  const accessExpiresAt = new Date(
    Date.now() + authConfig.jwtAccessExpiresIn * 1000
  );
  const refreshExpiresAt = new Date(
    Date.now() + authConfig.jwtRefreshExpiresIn * 1000
  );
  return { accessExpiresAt, refreshExpiresAt };
}

// Send a successful response with user and token data
async function sendAuthResponse(res, user) {
  const { accessToken, refreshToken } = await generateTokens(user);
  const { accessExpiresAt, refreshExpiresAt } = getTokensExpirationDates();

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    expires: refreshExpiresAt,
    path: "/api/auth",
    signed: true,
  });
  res.status(OK).json({
    access_token: accessToken,
    token_type: "Bearer",
    access_expires_at: accessExpiresAt,
    refresh_expires_at: refreshExpiresAt,
  });
}

const signup = async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) {
    throw new CustomError("Unable to create a new user", INTERNAL_SERVER_ERROR);
  }

  await sendAuthResponse(res, user);
};

const login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) {
    throw new CustomError("Login error: user not found", UNAUTHORIZED);
  }

  const isPasswordMatch = await user.comparePassword(req.body.password);
  if (!isPasswordMatch) {
    throw new CustomError(
      "Login error: invalid email or password",
      UNAUTHORIZED
    );
  }

  sendAuthResponse(res, user);
};

const refresh = async (req, res) => {
  sendAuthResponse(res, req.user);
};

const logout = async (req, res) => {
  const { jti, sub, exp } = req.user.tokenToRevoke;
  await revokeRefreshToken({
    user_id: sub,
    expires_at: new Date(exp * 1000),
    jti,
  });
  res
    .clearCookie("refresh_token", {
      httpOnly: true,
      path: "/api/auth",
      signed: true,
    })
    .status(OK);
};

module.exports = {
  signup: asyncWrapper(signup),
  login: asyncWrapper(login),
  refresh: asyncWrapper(refresh),
  logout: asyncWrapper(logout),
};
