const { INTERNAL_SERVER_ERROR } = require("http-status-codes").StatusCodes;
const CustomError = require("../utils/CustomError");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  // Handle the custom error
  if (err instanceof CustomError) {
    const { status, message, clearCookie } = err;
    // Clear the refresh token cookie from the client's browser
    if (clearCookie) {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        path: "/api/auth",
        signed: true,
      });
    }

    res.status(status).json({
      message,
    });
  } else {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
};

module.exports = errorHandler;
