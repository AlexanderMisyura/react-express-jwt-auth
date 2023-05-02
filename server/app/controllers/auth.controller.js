// Import the User model
const { User } = require("../models");

// Import function for tokens generation
const { generateTokens } = require("../services/token.service");

// Import the auth configuration file
const authConfig = require("../config/auth.config");

function getTokensExpirationDates() {
  const accessExpiresAt = new Date(
    Date.now() + authConfig.jwtAccessExpiresIn * 1000
  );
  const refreshExpiresAt = new Date(
    Date.now() + authConfig.jwtRefreshExpiresIn * 1000
  );
  return { accessExpiresAt, refreshExpiresAt };
}

async function sendAuthResponse(req, res, user) {
  // Get a used refresh token if any
  const usedRefreshToken = req.signedCookies.refresh_token;
  // Generate tokens for the user
  const { accessToken, refreshToken } = generateTokens(user, usedRefreshToken);
  const { accessExpiresAt, refreshExpiresAt } = getTokensExpirationDates();

  // Send a success response with the user and token data
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    expires: refreshExpiresAt,
    path: "/api/auth",
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
}

// Define a function to handle user signup requests
exports.signup = async (req, res) => {
  try {
    // Create a new user with the data from the request body
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    sendAuthResponse(req, res, user);
  } catch (err) {
    // Send an error response with the error message
    res.status(500).json({ message: `registration error: ${err}` });
  }
};

// Define a function to handle user login requests
exports.login = async (req, res) => {
  try {
    // Find a user with the email from the request body
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    // If no user is found, send a not found response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the password from the request body with the user's password using a custom method
    const isPasswordMatch = await user.comparePassword(req.body.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    sendAuthResponse(req, res, user);
  } catch (err) {
    // Send an error response with the error message
    res.status(500).json({ message: `login error: ${err}` });
  }
};

exports.refresh = async (req, res) => {
  try {
    sendAuthResponse(req, res, req.user);
  } catch (err) {
    // Send an error response with the error message
    res.status(500).json({ message: `token error: ${err}` });
  }
};
