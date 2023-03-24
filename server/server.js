const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./app/config/.env" });

const app = express();

app.use(cors());

app.use(express.json());

const db = require("./app/models");
db.sequelize
  .authenticate()
  .then(() => console.log("db connection ok"))
  .catch((err) => console.log("db connection error", err));

app.use("/", (req, res) => {
  res.json({ hello: "hi" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("api is running on localhost, port 8000"));
