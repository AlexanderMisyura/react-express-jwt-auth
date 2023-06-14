const { BAD_REQUEST, OK } = require("http-status-codes").StatusCodes;
const { Sequelize, User, Role } = require("../models");
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

// Send a successful response with user and token data
async function sendAuthResponse(res, user) {
  const { accessToken, refreshToken } = await generateTokens(user);
  const refreshExpiresAt = Date.now() + authConfig.jwtRefreshExpiresIn * 1000;

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    expires: new Date(refreshExpiresAt),
    path: "/api/auth",
    signed: true,
  });
  res.status(OK).json({
    access_token: accessToken,
    token_type: "Bearer",
    refresh_expires_at: refreshExpiresAt,
  });
}

const signup = async (req, res) => {
  const { roles } = authConfig;
  if (req.body.isAdmin) {
    roles.push("admin");
  }
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

  const userRoles = await Role.findAll({
    where: { role_name: { [Sequelize.Op.or]: roles } },
  });
  await user.addRoles(userRoles);

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
