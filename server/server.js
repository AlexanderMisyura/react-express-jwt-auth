const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./app/config/.env" });

const app = express();

app.use(cors());

app.use(express.json());

const { sequelize } = require("./app/models");

sequelize
  .sync()
  .then(() => {
    console.log("Database models synchronization successful.");
  })
  .catch((err) => {
    console.error("Database models synchronization failed:", err);
  });

app.use("/", (req, res) => {
  res.json({ hello: "hi" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("api is running on localhost, port 8000"));
