// Import the User model and the jwt library
const { User } = require("../models");
const jwt = require("jsonwebtoken");

// Import the auth configuration file
const authConfig = require("../config/auth.config");

// Set the expiration time for the token in seconds
const expiresIn = 86400;

// Set the scope of the token
const scope = "browse cart order profile review";

// Define a function to handle user signup requests
exports.signup = async (req, res) => {
  try {
    // Create a new user with the data from the request body
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // Generate a token for the user using the secret key and the expiration time
    const token = jwt.sign({ userId: user.id }, authConfig.secret, {
      expiresIn,
    });

    // Send a success response with the user and token data
    res.status(200).json({
      message: "Registration success",
      user_id: user.id,
      username: user.username,
      email: user.email,
      access_token: token,
      token_type: "Bearer",
      expires_in: expiresIn,
      scope: scope,
    });
  } catch (error) {
    // Send an error response with the error message
    res.status(500).json({ message: `registration error: ${error}` });
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

    // Generate a token for the user using the secret key and the expiration time
    const token = jwt.sign({ userId: user.id }, authConfig.secret, {
      expiresIn,
    });

    // Send a success response with the user and token data
    res.status(200).json({
      user_id: user.id,
      username: user.username,
      email: user.email,
      access_token: token,
      token_type: "Bearer",
      expires_in: expiresIn,
      scope: scope,
    });
  } catch (error) {
    // Send an error response with the error message
    res.status(500).json({ message: `login error: ${error}` });
  }
};
