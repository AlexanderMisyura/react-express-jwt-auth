const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const authConfig = require("../config/auth.config");

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
function generateRefreshToken(user) {
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
}

exports.generateTokens = (user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};
