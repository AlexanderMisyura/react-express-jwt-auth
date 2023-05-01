const { INTERNAL_SERVER_ERROR } = require("http-status-codes").StatusCodes;

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  // Check if the error has a clearCookie property
  if (err.clearCookie) {
    // Clear the refresh token cookie from the client's browser
    res.clearCookie("refresh_token", {
      httpOnly: true,
      path: "/api/auth",
      signed: true,
    });
  }

  // Send the error message and status to the client
  res.status(err.status || INTERNAL_SERVER_ERROR).json({
    message: err.message || "Something went wrong",
  });
};

module.exports = errorHandler;
