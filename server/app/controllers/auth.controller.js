// Import the User model
const { User } = require("../models");

// Import functions for token generation
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/token.service");

// Import the auth configuration file
const authConfig = require("../config/auth.config");

// Define a function to handle user signup requests
exports.signup = async (req, res) => {
  try {
    // Create a new user with the data from the request body
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // Generate tokens for the user
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    const accessExpiresAt = new Date(
      Date.now() + authConfig.jwtAccessExpiresIn * 1000
    );
    const refreshExpiresAt = new Date(
      Date.now() + authConfig.jwtRefreshExpiresIn * 1000
    );

    // Send a success response with the user and token data
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      expires: refreshExpiresAt,
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
    user.comparePassword(req.body.password, (err, isMatch) => {
      // If there is an error, send an error response
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // If the passwords do not match, send an unauthorized response
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    });

    // Get an old refresh token if any
    const oldRefreshToken = req.cookies.refresh_token;

    // Generate tokens for the user using service functions
    const accessToken = generateAccessToken(user);

    const refreshToken = await generateRefreshToken(user, oldRefreshToken);

    const accessExpiresAt = new Date(
      Date.now() + authConfig.jwtAccessExpiresIn * 1000
    );
    const refreshExpiresAt = new Date(
      Date.now() + authConfig.jwtRefreshExpiresIn * 1000
    );

    // Send a success response with the user and token data
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      expires: refreshExpiresAt,
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
