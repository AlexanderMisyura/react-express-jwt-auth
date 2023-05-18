const { BAD_REQUEST, OK } = require("http-status-codes").StatusCodes;
const { User } = require("../models");
const {
  generateTokens,
  revokeRefreshToken,
} = require("../services/token.service");
const authConfig = require("../config/auth.config");
const {
  AppError,
  AuthorizationError,
  DatabaseError,
} = require("../utils/errorClasses");
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
  }).catch((err) => {
    throw new DatabaseError(err.message, err);
  });

  if (!user) {
    throw new AppError(
      `Unable to create a new user. ${err.message}`,
      BAD_REQUEST
    );
  }

  await sendAuthResponse(res, user);
};

const login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  }).catch((err) => {
    throw new DatabaseError(err.message, err);
  });

  if (!user) {
    throw new AuthorizationError("Authorization error. User not found");
  }

  const isPasswordMatch = await user.comparePassword(req.body.password);
  if (!isPasswordMatch) {
    throw new AuthorizationError(
      "Authorization error. Invalid email or password"
    );
  }

  sendAuthResponse(res, user);
};

const refresh = async (req, res) => {
  sendAuthResponse(res, req.user);
};

const logout = async (req, res) => {
  if (req?.user?.tokenToRevoke) {
    const { jti, sub, exp } = req.user.tokenToRevoke;
    await revokeRefreshToken({
      user_id: sub,
      expires_at: new Date(exp * 1000),
      jti,
    });
  }
  res
    .clearCookie("refresh_token", {
      httpOnly: true,
      path: "/api/auth",
      signed: true,
    })
    .status(OK)
    .json({ message: "Logged out" });
};

module.exports = {
  signup: asyncWrapper(signup),
  login: asyncWrapper(login),
  refresh: asyncWrapper(refresh),
  logout: asyncWrapper(logout),
};
