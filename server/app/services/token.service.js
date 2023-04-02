const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const { RefreshToken } = require("../models");

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

// Generate refresh token and save it to DB
async function generateRefreshToken(user) {
  // Delete expired refresh token from DB if any
  try {
    if (user.expiredRefreshToken) {
      const decoded = jwt.verify(
        user.expiredRefreshToken,
        authConfig.JWT_REFRESH_SECRET,
        { ignoreExpiration: true }
      );

      await RefreshToken.destroy({
        where: {
          jti: decoded.jti,
        },
      });
    }

    const dbToken = await RefreshToken.create({ user_id: user.id });

    const refreshToken = jwt.sign(
      {
        sub: user.id,
        name: user.username,
        email: user.email,
        iss: authConfig.JWT_ISS,
        jti: dbToken.jti,
      },
      authConfig.JWT_REFRESH_SECRET,
      {
        expiresIn: authConfig.jwtRefreshExpiresIn,
      }
    );

    return refreshToken;
  } catch (err) {
    // Invalid token format
    if (err.name === "JsonWebTokenError") {
      // Throw an error with status code 400 and custom message
      throw { status: 400, message: "Invalid token" };
      // Token has expired
    } else {
      // Throw an error with status code 500 and generic message
      throw { status: 500, message: "Internal server error" };
    }
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
