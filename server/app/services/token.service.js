const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { RevokedRefreshToken } = require("../models");
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
async function generateRefreshToken(user) {
  // Add used refresh token to revoked DB table
  if (user.tokenToRevoke) {
    const { jti, exp } = user.tokenToRevoke;
    await RevokedRefreshToken.create({
      user_id: user.id,
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
}

exports.generateTokens = async (user) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    return { accessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};
