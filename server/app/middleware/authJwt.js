const jwt = require("jsonwebtoken");
const { User, RefreshToken } = require("../models");
const config = require("../config/auth.config");

const verifyAccessToken = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res
      .status(403)
      .json({ message: "Forbidden: access token not provided" });
  }

  try {
    const decoded = jwt.verify(accessToken, config.JWT_ACCESS_SECRET);

    // Find a user with the sub claim (user id) from the decoded access token payload
    const user = await User.findByPk(decoded.sub);

    if (!user) {
      res.clearCookie("refresh_token", { httpOnly: true });
      return res
        .status(403)
        .json({ message: "Forbidden: no user matching the access token" });
    }

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json(err);
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res
      .status(403)
      .json({ message: "Forbidden: refresh token not provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);

    // Find a refresh token with the sub claim (user id) and jti claim (JWT identifier)
    // from the decoded refresh token payload
    const refreshTokenDB = await RefreshToken.findOne({
      where: {
        user_id: decoded.sub,
        jti: decoded.jti,
      },
    });

    if (!refreshTokenDB) {
      res.clearCookie("refresh_token", { httpOnly: true });
      return res
        .status(403)
        .json({ message: "Forbidden: no match between user and token" });
    }

    // Find a user with the sub claim (user id) from the decoded refresh token payload
    const user = await User.findByPk(decoded.sub);

    if (!user) {
      await refreshTokenDB.destroy();
      res.clearCookie("refresh_token", { httpOnly: true });
      return res
        .status(403)
        .json({ message: "Forbidden: no match between user and token" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    await RefreshToken.destroy({
      where: {
        user_id: decoded.sub,
        jti: decoded.jti,
      },
    });
    res.clearCookie("refresh_token", { httpOnly: true });
    return res.status(401).json(err);
  }
};

const authJwt = {
  verifyAccessToken,
  verifyRefreshToken,
};

module.exports = authJwt;
