const { INTERNAL_SERVER_ERROR } = require("http-status-codes").StatusCodes;
const { AppError } = require("../utils/errorClasses");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  // Handle the custom error
  if (err instanceof AppError) {
    const { status, clearCookie } = err;
    // Clear the refresh token cookie from the client's browser
    if (clearCookie) {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        path: "/api/auth",
        signed: true,
      });
    }

    res.status(status).json({
      err,
    });
  } else {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
};

module.exports = errorHandler;
