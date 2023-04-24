// Import access token generation function
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/token.service");

// Import the auth configuration file
const authConfig = require("../config/auth.config");

exports.provideAccess = (req, res) => {
  res
    .status(200)
    .json({ message: "access provided", data: "some protected data" });
};

exports.refreshAccess = async (req, res) => {
  try {
    const oldRefreshToken = req.signedCookies.refresh_token_verify;

    // Generate tokens for the user using service functions
    const accessToken = generateAccessToken(req.user);
    const refreshToken = await generateRefreshToken(req.user, oldRefreshToken);

    const accessExpiresAt = new Date(
      Date.now() + authConfig.jwtAccessExpiresIn * 1000
    );
    const refreshExpiresAt = new Date(
      Date.now() + authConfig.jwtRefreshExpiresIn * 1000
    );

    // Send a success response with the user and token data
    res.cookie("refresh_token_auth", refreshToken, {
      httpOnly: true,
      expires: refreshExpiresAt,
      path: "/api/auth/login",
      signed: true,
    });
    res.cookie("refresh_token_verify", refreshToken, {
      httpOnly: true,
      expires: refreshExpiresAt,
      path: "/api/verify/refresh",
      signed: true,
    });
    res.status(200).json({
      access_token: accessToken,
      token_type: "Bearer",
      access_expires_in: authConfig.jwtAccessExpiresIn,
      access_expires_at: accessExpiresAt,
      refresh_expires_in: authConfig.jwtRefreshExpiresIn,
      refresh_expires_at: refreshExpiresAt,
    });
  } catch (err) {
    // Send an error response with the error message
    res.status(500).json({ message: `login error: ${err}` });
  }
};
