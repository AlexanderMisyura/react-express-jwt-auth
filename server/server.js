const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: "./app/config/.env" });
const { COOKIE_SECRET } = require("./app/config/auth.config");
const { errorHandler } = require("./app/middleware");
const { deleteTokensTask } = require("./app/services/cron.service");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser(COOKIE_SECRET));

const { sequelize } = require("./app/models");

sequelize
  .sync()
  .then(() => {
    console.log("Database models synchronization successful.");
  })
  .catch((err) => {
    console.error("Database models synchronization failed:", err);
  });

deleteTokensTask.start();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received.");
  deleteTokensTask.stop();
  process.exit(0);
});

app.use("/api/auth", require("./app/routes/auth.route"));
app.use("/api/verify", require("./app/routes/access.route"));
app.use("/api/check", require("./app/routes/check.route"));

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`api is running on localhost, port ${PORT}`)
);
