const jwt = require("jsonwebtoken");
const { UNAUTHORIZED, FORBIDDEN } = require("http-status-codes").StatusCodes;
const { User, RevokedRefreshToken } = require("../models");
const authConfig = require("../config/auth.config");
const { TokenError } = require("../utils/errorClasses");

/**
 * A middleware function that verifies the access token in the authorization header
 * and adds the user object to the req object if valid
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const verifyAccessToken = async (req, res, next) => {
  try {
    // Get the authorization header from the request,
    // check if the authorization header exists and starts with "Bearer"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new TokenError("Access not provided. Please log in.", UNAUTHORIZED);
    }

    // Extract the access token from the authorization header
    const accessToken = authHeader.split(" ")[1];
    // Verify and decode the access token using the secret key
    const decoded = jwt.verify(accessToken, authConfig.JWT_ACCESS_SECRET);

    // Find a user in the database with the sub claim (user id)
    // from the decoded access token payload
    const user = await User.findByPk(decoded.sub);

    if (!user) {
      const err = new TokenError(
        "Forbidden: no user matching the access token",
        FORBIDDEN,
        true
      );
      throw err;
    }

    // Add the user object to the req object for further use
    req.user = user;

    next();
  } catch (err) {
    // Check if the error is a JWT error
    if (err instanceof jwt.JsonWebTokenError) {
      err = new TokenError(err.message, FORBIDDEN, true, err);
      if (err instanceof jwt.TokenExpiredError) {
        err.clearCookie = true;
      }
    }
    next(err);
  }
};

/**
 * A middleware function that verifies the refresh token in the signed cookie
 * and adds the user object to the req object if valid
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const verifyRefreshToken = async (req, res, next) => {
  try {
    // Get the refresh token from the signed cookie
    const refreshToken = req.signedCookies.refresh_token;

    if (!refreshToken && req.path !== "/logout") {
      const err = new TokenError(
        "Forbidden: refresh token is missing or invalid.",
        FORBIDDEN,
        true
      );
      throw err;
    }

    if (refreshToken) {
      // Verify and decode the refresh token using the secret key
      const decoded = jwt.verify(refreshToken, authConfig.JWT_REFRESH_SECRET);

      // Check if refresh token is already revoked
      const revokedRefreshToken = await RevokedRefreshToken.findOne({
        where: {
          user_id: decoded.sub,
          jti: decoded.jti,
        },
      });

      if (revokedRefreshToken && req.path !== "/logout") {
        const err = new TokenError(
          "Forbidden: provided refresh token was revoked",
          FORBIDDEN,
          true
        );
        throw err;
      }

      // Find a user with the sub claim (user id) from the decoded refresh token payload
      const user = await User.findByPk(decoded.sub);

      if (!user && req.path !== "/logout") {
        const err = new TokenError(
          "Forbidden: no user matching the refresh token or the token was forged",
          FORBIDDEN,
          true
        );
        throw err;
      }

      // Add the user object to the req object for further use
      if (user) {
        req.user = user;
        req.user.tokenToRevoke = decoded;
      }
    }

    next();
  } catch (err) {
    // Check if the error is a JWT error
    if (err instanceof jwt.JsonWebTokenError) {
      err = new TokenError(err.message, FORBIDDEN, true, err);
    }
    next(err);
  }
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};
