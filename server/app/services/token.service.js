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
async function generateRefreshToken(user, expiredRefreshToken) {
  // Delete expired refresh token from DB if any
  try {
    if (expiredRefreshToken) {
      const decoded = jwt.verify(
        expiredRefreshToken,
        authConfig.JWT_REFRESH_SECRET,
        { ignoreExpiration: true }
      );

      await RefreshToken.destroy({
        where: {
          user_id: decoded.sub,
          jti: decoded.jti,
        },
      });
    }

    const dbToken = await RefreshToken.create({
      user_id: user.id,
      expires_at: Date.now() + authConfig.jwtRefreshExpiresIn * 1000,
    });

    const refreshToken = jwt.sign(
      {
        sub: user.id,
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

exports.generateTokens = async (user, expiredRefreshToken) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, expiredRefreshToken);
    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};
