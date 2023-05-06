const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { RevokedRefreshToken } = require("../models");
const authConfig = require("../config/auth.config");
const CustomError = require("../utils/CustomError");
const { INTERNAL_SERVER_ERROR } = require("http-status-codes").StatusCodes;

async function revokeRefreshToken(token) {
  try {
    const { user_id, expires_at, jti } = token;
    await RevokedRefreshToken.create({ user_id, expires_at, jti });
  } catch (err) {
    throw new CustomError(
      `Unable to revoke a used token. ${err.message}`,
      INTERNAL_SERVER_ERROR
    );
  }
}

// Generate access token
function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      name: user.username,
      email: user.email,
      scope: authConfig.userScope,
    },
    authConfig.JWT_ACCESS_SECRET,
    {
      expiresIn: authConfig.jwtAccessExpiresIn,
    }
  );
}

// Generate a new refresh token and revoke the used one if any
async function generateRefreshToken(user) {
  try {
    // Add used refresh token to revoked DB table
    if (user.tokenToRevoke) {
      const { jti, sub, exp } = user.tokenToRevoke;
      await revokeRefreshToken({
        user_id: sub,
        expires_at: new Date(exp * 1000),
        jti,
      });
    }
    const refreshToken = jwt.sign(
      {
        sub: user.id,
        iss: authConfig.JWT_ISS,
        jti: uuidv4(),
      },
      authConfig.JWT_REFRESH_SECRET,
      {
        expiresIn: authConfig.jwtRefreshExpiresIn,
      }
    );

    return refreshToken;
  } catch (err) {
    throw err;
  }
}

const generateTokens = async (user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  generateTokens,
  revokeRefreshToken,
};
